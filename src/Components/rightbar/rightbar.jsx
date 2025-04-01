import "./rightbar.css";
import { ExpandMore } from "@mui/icons-material";
export default function rightbar() {

  const HomeRightbar = ({ profile }) => {
    return (

      <>
        <div className="rightbarTop">
          <ul className="rightbarTrendingList">
            <div className="rightbarTitlePart">
              <span className="rightbarTitle">
                Trending Topics
              </span>
            </div>

            <li className="rightbarTopListItem">
              <span className="TopListTitle">Flair Event</span>
              <span className="TopListProvider">Hub 1</span>
            </li>
            <li className="rightbarTopListItem">
              <span className="TopListTitle">Docker Workshop</span>
              <span className="TopListProvider">Encode Club</span>
            </li>
            <li className="rightbarTopListItem"></li>
            <li className="rightbarbtn">
              <ExpandMore />
            </li>

          </ul>

        </div>
        <div className="rightbarBottom">
          <div className="rightbarTitlePart">
            <span className="rightbarSuggetionTitle">
              Suggetions
            </span>
          </div>
          <ul className="rightbarSuggestionList">
            <li className="rightbarSuggetionItem">
              <img src="/assets/react.svg" alt="" className="rightbarSuggetionImg" />
              <div className="SuggetionCandidate">
                <span className="SgName">Group 1</span>
                <p className="SgItemDesc">Created by 21 Oct,2023</p>
              </div>

            </li>
            <li className="rightbarSuggetionItem">
              <img src="/assets/react.svg" alt="" className="rightbarSuggetionImg" />
              <div className="SuggetionCandidate">
                <span className="SgName">Club 1</span>
                <p className="SgItemDesc">Created by 21 Oct,2023</p>
              </div>

            </li>
            <li className="rightbarSuggetionItem">
              <img src="/assets/react.svg" alt="" className="rightbarSuggetionImg" />
              <div className="SuggetionCandidate">
                <span className="SgName">Hub 1</span>
                <p className="SgItemDesc">Created by 21 Oct,2023</p>
              </div>

            </li>
            <li className="rightbarSuggetionItem">
              <img src="/assets/react.svg" alt="" className="rightbarSuggetionImg" />
              <div className="SuggetionCandidate">
                <span className="SgName">Hub 2</span>
                <p className="SgItemDesc">Created by 21 Oct,2023</p>
              </div>

            </li>





          </ul>
        </div>

      </>

    );
  }

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">User InforMation Title</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">RollNo. : </span>
            <span className="rightbarInfoValue">23BCP512D</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Department : </span>
            <span className="rightbarInfoValue">Sot</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Branch : </span>
            <span className="rightbarInfoValue">CSE</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City : </span>
            <span className="rightbarInfoValue">New York</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          <div className="rightbarFollowing">
            <img
              src="assets/Person/1.jpeg"
              alt=""
              className="rightbarFollowingImg"
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="assets/Person/1.jpeg"
              alt=""
              className="rightbarFollowingImg"
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="assets/Person/1.jpeg"
              alt=""
              className="rightbarFollowingImg"
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="assets/Person/1.jpeg"
              alt=""
              className="rightbarFollowingImg"
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>



        </div>
      </>
    );
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {/* <ProfileRightbar /> */}
        <HomeRightbar/>
      </div>
    </div>

  );
}

