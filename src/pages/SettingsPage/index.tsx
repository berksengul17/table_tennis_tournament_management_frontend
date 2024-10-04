import { useState } from "react";
import { saveImage } from "../../api/tournamentImgApi";

function SettingsPage() {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const handleSave = () => {
    saveImage(tournamentName, image);
  };

  return (
    <div>
      <button onClick={handleSave}>Kaydet</button>
      <div>
        <span>Turnuva Adı</span>
        <input
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
      </div>
      <div>
        <span>Turnuva Afişi</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target?.files?.[0] || null)}
        />
      </div>
      <div>
        <span>Kategoriler</span>
      </div>
    </div>
  );
}

export default SettingsPage;
