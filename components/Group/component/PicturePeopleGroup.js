import Styled from "../Detail/DetailContentGroup.module.css";

function PicturePeopleGroup(props) {
    return (
        <>
            <span className={Styled["picture-people-Group"]}>
                <img
                    src={props.avatar}
                    alt="picture-user"
                    width={35}
                    height={35}
                />
            </span>
        </>
    );
}

export default PicturePeopleGroup;