import "./share.css";
import { PermMedia, Label,Room, EmojiEmotions } from "@mui/icons-material";
export default function share() {
    return (
        <div className="share">
            <div className="shareWrapper">
                {/* i Am shareq */}
                <div className="shareTop">
                    <img className="shareProfileImg" src="/assets/Person/Profilepic.png" alt="" />
                    <input
                        placeholder="What's in your mind Raj?"
                        className="shareInput"
                    />
                </div>
                <hr className="shareHr" />
                <div className="shareBottom">
                    <div className="shareOptions">
                        <div className="shareOption">
                            <PermMedia htmlColor="Black" className="shareIcon" />
                            <span className="shareOptionText">Photo or Video</span>
                        </div>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="Yellow" className="shareIcon" />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="Red" className="shareIcon" />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton">Share</button>
                </div>
            </div>
        </div>
    );
}
