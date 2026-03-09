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
        borderLeft: "3px solid #f59e0b",
        paddingLeft: "1.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "Space Mono",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "Space Mono",
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

export function CreateServicesImageComponent({ trainingCount }: { trainingCount: number }) {
  const years = `${new Date().getFullYear() - 2020}+`;

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
          justifyContent: "center",
          height: "100%",
          maxWidth: "540px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 700,
            fontSize: "3.5rem",
            color: "#ffffff",
            lineHeight: 1.15,
          }}
        >
          <span>DevOps služby</span>
          <span>
            na&nbsp;<span style={{ color: "#f59e0b" }}>míru</span>
          </span>
        </div>
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "1.25rem",
            lineHeight: 1.6,
            fontFamily: "Space Mono",
            color: "#a1a1aa",
          }}
        >
          Pomáhám firmám budovat a spravovat moderní infrastrukturu.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            marginTop: "0.75rem",
            fontFamily: "Space Mono",
            fontSize: "1.25rem",
            color: "#a1a1aa",
          }}
        >
          <span>• Konzultace</span>
          <span>• Školení</span>
          <span>• Dlouhodobá spolupráce</span>
        </div>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 400,
            fontFamily: "Space Mono",
            color: "#71717a",
            marginTop: "auto",
            marginBottom: 0,
          }}
        >
          mares.cz/sluzby
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <StatItem value={`${years} let`} description="praxe v DevOps a cloudové infrastruktuře" />
        <StatItem value="20+ projektů" description="úspěšně dokončených napříč obory" />
        <StatItem value={`${trainingCount} školení`} description="pravidelně vypisovaných témat" />
      </div>
    </div>
  );
}
