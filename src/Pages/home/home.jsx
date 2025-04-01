import "./home.css"
import TopBar from "../../Components/TopBar/topbar"
import Sidebar from "../../Components/sidebar/sidebar"
import Rightbar from "../../Components/rightbar/rightbar"
import Feed from "../../Components/feed/feed"
export default function home() {
  return (
   <>
      <TopBar/>
      <div className="homeContainer">


      <Sidebar/>
      <Feed/>
      <Rightbar/>
      </div>
   </>
  );
}
