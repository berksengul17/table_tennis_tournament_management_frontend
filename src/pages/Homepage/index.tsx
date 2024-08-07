import img from "../../assets/images/afiş.png";

function Homepage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "1rem",
      }}
    >
      <img
        src={img}
        alt="Afiş"
        style={{
          maxWidth: "80%",
        }}
      />
    </div>
  );
}

export default Homepage;
