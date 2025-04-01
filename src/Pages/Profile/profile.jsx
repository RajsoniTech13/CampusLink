import "./profile.css";
import TopBar from "../../Components/TopBar/topbar"
import Sidebar from "../../Components/sidebar/sidebar"
import Rightbar from "../../Components/rightbar/rightbar"
import Feed from "../../Components/feed/feed"
export default function profile() {
  return (

    <>


      <TopBar />
      <div className="profile">


        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
          <div className="profileCover">
              <img src="assets/Posts/3.jpeg" alt="" className="profileCoverImg" />
              <img src="assets/Person/1.jpeg" alt="" className="profileUserImg" />
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">RajSoni</h4>
            <span className="profileInfoName">I am in Gandhinagar</span>
          </div>
          </div>
          <div className="profileRightBottom">


            <Feed profile />
            <Rightbar profile/>
          </div>
        </div>
      </div>
    </>
  );
}
