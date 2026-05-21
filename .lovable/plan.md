## Objectif

Mettre en place deux couches de contenu :

1. **CMS manuel** (déjà partiellement en place avec `news_articles`) — étendu aux **joueurs / staff** et **galerie photos**.
2. **Données sportives automatiques** — `competitions`, `teams_ext`, `fixtures`, `results`, `standings` alimentées par une API externe (API-Football côté RapidAPI recommandé) via une edge function, avec **cron horaire** + **bouton "Synchroniser maintenant"** dans `/admin`.

Couverture multi-sports : l'API n'alimente que le **football**. Les autres sports (basket, handball, etc.) utilisent les mêmes tables mais sont **édités manuellement** dans l'admin (drapeau `source = 'manual' | 'api'`).

## Architecture

```text
┌──────────────┐      ┌────────────────────┐      ┌──────────────┐
│ API-Football │─────▶│ Edge Function      │─────▶│  Supabase    │
│  (RapidAPI)  │      │  sync-sports-data  │      │  (tables)    │
└──────────────┘      └─────────┬──────────┘      └──────┬───────┘
                                │ cron pg_cron           │
                      ┌─────────▼──────────┐             │
                      │ Admin "Sync now"   │             │
                      └────────────────────┘             ▼
                                                  ┌──────────────┐
                                                  │  React app   │
                                                  └──────────────┘
```

## Étapes

### 1. Migration Supabase — nouvelles tables

**CMS manuel**
- `players` : sport, team, jersey_number, name_en/fr/ar, position, nationality, dob, photo_url, bio_en/fr/ar, is_staff (bool), staff_role, active, sort_order.
- `photos` : album, title_en/fr/ar, image_url, taken_at, sort_order.

**Données sportives (alimentées par API ou manuel)**
- `competitions` : ext_id, sport, name_en/fr/ar, season, country, logo_url.
- `sport_teams` : ext_id, sport, name_en/fr/ar, short_name, logo_url, is_alahli.
- `fixtures` : ext_id, sport, competition_id, home_team_id, away_team_id, kickoff_at, venue, status (`scheduled|live|finished|postponed`), home_score, away_score, source (`api|manual`), raw (jsonb), updated_at.
- `standings` : competition_id, season, team_id, rank, played, won, drawn, lost, gf, ga, points, source, updated_at.
- `sync_runs` : journal (started_at, finished_at, success, items_upserted, error).

RLS : lecture publique sur tout, écriture réservée admins/éditeurs. Index sur (sport, kickoff_at), (competition_id, rank).

### 2. Edge function `sync-sports-data`

- Récupère depuis l'API externe : compétitions suivies, fixtures (passés + à venir), standings.
- Upsert par `ext_id` dans Supabase.
- N'écrase **jamais** les lignes `source = 'manual'`.
- Écrit une entrée dans `sync_runs`.
- Auth : header `x-admin-key` (secret) OU appel signé par pg_cron.
- Clé API stockée en secret `SPORTS_API_KEY` (à demander quand on en sera là — pour le moment l'edge function tournera en mode mock si la clé n'est pas définie, pour que tout soit testable).

### 3. Cron + bouton manuel

- `pg_cron` + `pg_net` : appel horaire de l'edge function.
- Page `/admin/sync` : bouton "Synchroniser maintenant" + tableau des 20 derniers `sync_runs` (statut, durée, items).

### 4. Admin CMS — nouvelles sections

Sous `/admin` (déjà existant pour articles) :
- `/admin/players` : CRUD joueurs/staff avec filtre par sport, upload photo (bucket `players`).
- `/admin/photos` : CRUD galerie, upload (bucket `gallery`).
- `/admin/fixtures` : CRUD pour les sports non-football (création manuelle), lecture seule pour ceux marqués `source='api'`.
- `/admin/sync` : voir étape 3.

### 5. Front — branchement

Remplacer les données mockées par des reads Supabase dans :
- `src/components/home/NextMatch.tsx` → `fixtures` (prochain `scheduled` de l'équipe Al-Ahli foot).
- `src/pages/MatchCenter.tsx`, `src/pages/MatchDetail.tsx` → `fixtures`.
- `src/pages/Standings.tsx`, `SportStandingsPage`, `SportSchedulePage` → `standings` / `fixtures`.
- `src/components/teams/SquadGrid.tsx` + `StaffGrid` → `players`.

Les helpers existants (`src/lib/fixtures.ts`, `src/lib/roster.ts`) deviennent de simples types/mappers ; le fetch passe par `@tanstack/react-query` avec le client supabase.

### 6. Buckets storage

- `players` (public) — photos joueurs/staff.
- `gallery` (public) — photos club.
- Politiques : lecture publique, upload réservé admins/éditeurs.

## Détails techniques

- **Pas d'auth provider supplémentaire** : on réutilise `user_roles` + `has_role()` existants.
- **Pas de breaking change i18n** : on ajoute les clés `admin.players`, `admin.photos`, `admin.sync`, `sync.lastRun`, etc. dans `en/fr/ar`.
- **Compat ascendante** : les pages continuent à fonctionner même si les tables sont vides (états "À venir bientôt").
- **Choix API différé** : l'edge function expose une interface `SportsProvider` ; une implémentation `MockProvider` est livrée d'office. Le jour où tu fournis la clé RapidAPI, on remplace par `ApiFootballProvider` sans toucher au schéma ni au front.
- **Secrets nécessaires plus tard** : `SPORTS_API_KEY` (RapidAPI), `SYNC_ADMIN_KEY` (pour protéger l'appel manuel). Je te les demanderai au moment d'activer la vraie source.

## Ordre d'exécution

1. Migration (tables + RLS + buckets + pg_cron).
2. Edge function `sync-sports-data` (mode mock).
3. Pages admin `players`, `photos`, `sync`.
4. Branchement front (NextMatch, MatchCenter, Standings, Squad).
5. i18n (en/fr/ar).
6. Vérification build + smoke test des routes.