interface StatItemProps {
  value: string;
  description: string;
}

function StatItem({ value, description }: StatItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderLeft: "3px solid #f54a00",
        paddingLeft: "1.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "1rem",
          color: "#a1a1aa",
          marginTop: "0.25rem",
        }}
      >
        {description}
      </span>
    </div>
  );
}

export function CreateSessionsImageComponent({
  sessionCount,
  topicCount,
  nextSessionDate,
}: {
  sessionCount: number;
  topicCount: number;
  nextSessionDate: string | null;
}) {
  const formattedDate = nextSessionDate
    ? new Date(nextSessionDate).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "long",
      })
    : null;

  const hasStats = sessionCount > 0;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#18181b",
        padding: "3.5rem 4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: "540px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 700,
              fontFamily: "IBM Plex Sans",
              fontSize: "3.5rem",
              color: "#ffffff",
              lineHeight: 1.15,
            }}
          >
            <span>
              Veřejné&nbsp;<span style={{ color: "#f54a00" }}>termíny</span>
            </span>
            <span>školení</span>
          </div>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontFamily: "Inter",
              color: "#a1a1aa",
            }}
          >
            {hasStats
              ? "Otevřená školení pro jednotlivce i malé týmy. Přihlaste se na vypsaný termín a získejte praktické zkušenosti z oblasti DevOps a kontejnerů."
              : "Momentálně nejsou vypsány žádné veřejné termíny. Podívejte se na nabídku školení — rádi vám připravíme termín na míru."}
          </p>
        </div>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 400,
            fontFamily: "Inter",
            color: "#71717a",
            marginBottom: 0,
          }}
        >
          mares.cz/skoleni/verejne-terminy
        </p>
      </div>
      {hasStats && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <StatItem value={`${sessionCount} termínů`} description="vypsaných v nejbližších měsících" />
          <StatItem value={`${topicCount} témat`} description="z oblasti DevOps a kontejnerů" />
          {formattedDate && <StatItem value={formattedDate} description="nejbližší volný termín" />}
        </div>
      )}
    </div>
  );
}
