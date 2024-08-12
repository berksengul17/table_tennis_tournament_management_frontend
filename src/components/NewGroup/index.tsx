import "./index.css";

const TableComponent = () => {
  const data = [
    {
      name: "Dursun Erduran(Krk)",
      matches: ["", "3-1", "3-1", "3-0"],
      G: 3,
      M: 0,
      P: 6,
      S: 1,
    },
    {
      name: "Mahmut Furkan Kuzgun(Siv)",
      matches: ["1-3", "", "3-2", "3-2"],
      G: 2,
      M: 1,
      P: 5,
      S: 2,
    },
    {
      name: "Mehmet Ertav(Mem)",
      matches: ["1-3", "2-3", "", "3-1"],
      G: 1,
      M: 2,
      P: 4,
      S: 3,
    },
    {
      name: "Ahat Tezcan(Şan)",
      matches: ["0-3", "2-3", "1-3", ""],
      G: 0,
      M: 3,
      P: 3,
      S: 4,
    },
  ];

  return (
    <div>
      <h3>Grup 1 27.01.2024 11:30 Masa: 4</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th></th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>G</th>
            <th>M</th>
            <th>P</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.name}</td>
              {row.matches.map((match, matchIndex) => (
                <td key={matchIndex} className={match ? "" : "black-cell"}>
                  {match}
                </td>
              ))}
              <td>{row.G}</td>
              <td>{row.M}</td>
              <td>{row.P}</td>
              <td>{row.S}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
