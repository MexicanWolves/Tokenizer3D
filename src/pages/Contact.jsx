import ProfileCard from "../components/ProfileCard";
import SplitText from "../components/SplitText";
import ShinyText from "../components/ShinyText";

const Contact = () => {
  const teamMembers = [
    {
      name: "Teresa Rivas",
      title: "UX/UI Designer & Frontend Developer",
      handle: "tessarivasart",
      avatarUrl: "/teresa_profile_pic.png",
      iconUrl: "toksito.svg",
      linkedinUrl: "https://www.linkedin.com/in/teresa-rivas-g%C3%B3mez-072458294/",
    },
    {
      name: "Antonio Ramos",
      title: "Backend Developer",
      handle: "antonioramos",
      avatarUrl: "/antonio_profile_pic.png",
      iconUrl: "toksito.svg",
      linkedinUrl: "https://www.linkedin.com/in/antonio-ramos-gonzalez/",
    },
    {
      name: "Brayan Perez",
      title: "Backend Engineer",
      handle: "brayanperez",
      avatarUrl: "/brayan_profile_pic.png",
      iconUrl: "toksito.svg",
      linkedinUrl: "https://www.linkedin.com/in/brayanperez56/",
    },
    {
      name: "Andrea Rivas",
      title: "Analyst & Researcher",
      handle: "andrearivasg",
      avatarUrl: "/andrea_profile_pic.png",
      iconUrl: "toksito.svg",
      linkedinUrl: "https://www.linkedin.com/in/andrea-rivas-a6391a273/",
    },
    {
      name: "Adan Gonzalez",
      title: "Deployment Engineer",
      handle: "adangonzalez",
      avatarUrl: "/adan_profile_pic.png",
      iconUrl: "toksito.svg",
      linkedinUrl: "https://www.linkedin.com/in/adan-gonzalez-cese%C3%B1a-584411338/",
    },
  ];

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4 py-8 overflow-y-auto">
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-4 w-full max-w-7xl my-auto">
        {/* Título con SplitText */}
        <div className="text-center" style={{ fontFamily: "Michroma, sans-serif" }}>
          <SplitText
            text="Our Team"
            className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mt-10"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>

        {/* Subtítulo con ShinyText */}
        <ShinyText
          text="Meet the minds behind this project and their roles"
          disabled={false}
          speed={3}
          className="text-md sm:text-base md:text-xl lg:text-2xl text-center w-[50vw] max-w-3xl -mt-2 mix-blend-luminosity"
        />

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-5 md:gap-10 lg:gap-20 w-full pointer-events-auto px-2">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex justify-center w-full"
              style={{
                transform: "scale(0.8)",
                transformOrigin: "center center",
                margin: "-5% 0",
              }}
            >
              <ProfileCard
                name={member.name}
                title={member.title}
                handle={member.handle}
                status="Online"
                contactText="LinkedIn"
                avatarUrl={member.avatarUrl}
                iconUrl={member.iconUrl}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                handleStyle={(member.name === "Teresa Rivas" || member.name === "Brayan Perez") ? { color: "black" } : {}}
                statusStyle={(member.name === "Teresa Rivas" || member.name === "Brayan Perez") ? { color: "black" } : {}}
                contactStyle={(member.name === "Teresa Rivas" || member.name === "Brayan Perez") ? { color: "black" } : {}}
                onContactClick={() => {
                  window.open(member.linkedinUrl, "_blank", "noopener,noreferrer");
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;