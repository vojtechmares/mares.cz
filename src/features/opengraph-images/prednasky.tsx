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

export function CreatePrednaskyImageComponent({
  talkCount,
  eventCount,
  yearsOfSpeaking,
}: {
  talkCount: number;
  eventCount: number;
  yearsOfSpeaking: number;
}) {
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
            <span>Přednášky na</span>
            <span style={{ color: "#f54a00" }}>konferencích</span>
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
            Pravidelně přednáším na odborných konferencích v Česku i zahraničí. Sdílím praktické zkušenosti z oblasti
            DevOps, cloud-native technologií a moderní infrastruktury.
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
          mares.cz/prednasky
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
        <StatItem value={`${talkCount} přednášek`} description="na odborných konferencích" />
        <StatItem value={`${eventCount} konferencí`} description="v ČR i zahraničí" />
        <StatItem value={`${yearsOfSpeaking}+ roky`} description="zkušeností s přednášením" />
      </div>
    </div>
  );
}
