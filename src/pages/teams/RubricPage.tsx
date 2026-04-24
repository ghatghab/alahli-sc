import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/ComingSoon";

/**
 * Generic placeholder for a single rubric (Squad, Staff, Schedule, Standings, Honours)
 * inside a sport. Title is driven by the i18n key passed in.
 */
const RubricPage = ({ titleKey }: { titleKey: string }) => {
  const { t } = useTranslation();
  return (
    <div className="container-club pt-10">
      <h1 className="font-display text-3xl font-bold text-foreground">
        {t(titleKey)}
      </h1>
      <ComingSoon />
    </div>
  );
};

export default RubricPage;