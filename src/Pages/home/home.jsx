import { useState } from "react";
import "./home.css";
import TopBar from "../../Components/TopBar/topbar";
import Sidebar from "../../Components/sidebar/sidebar";
import Rightbar from "../../Components/rightbar/rightbar";
import Feed from "../../Components/feed/feed";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState("post"); // Default view

  return (
    <>
      <TopBar />
      <div className="homeContainer">
        <Sidebar onSectionChange={setSelectedSection} />
        <Feed section={selectedSection} />
        <Rightbar />
      </div>
    </>
  );
}
