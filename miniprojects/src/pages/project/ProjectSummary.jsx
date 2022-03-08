import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDocument } from "../../hooks/useDocument";
import { useHistory, Link } from "react-router-dom";
import Modal from "react-modal";
import { useState } from "react";
import { projectFirestore } from "../../firebase/config";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function ProjectSummary({ project }) {
  const { updateDocument } = useFirestore("projects");
  const { user } = useAuthContext();
  const history = useHistory();
  const { error, document: team } = useDocument("teams", project.team);
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  const handleComplete = (e) => {
    updateDocument(project.id, { completed: true });
    history.push("/");
  };

  const toggleModal = () => setShowModal((prevState) => !prevState);

  const showMembers = async () => {
    const members = await Promise.all(
      team.members.map((member) =>
        projectFirestore.collection("users").doc(member).get()
      )
    );
    setTeamMembers(members.map((m) => m.data()));
    toggleModal();
  };

  return (
    <div>
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={toggleModal}
          style={customStyles}
        >
          <h1>Team Members</h1>
          <ul>
            {teamMembers.map((member) => (
              <li>{member.displayName}</li>
            ))}
          </ul>
        </Modal>
      )}

      <div className="project-summary">
        <h2 className="page-title">{project.name}</h2>
        <p>By {project.createdBy.displayName}</p>
        <p className="due-date">
          Project Due by {project.dueDate.toDate().toDateString()}
        </p>
        <p className="details">{project.details}</p>
        <h4>Project is assigned to:</h4>
        <div className="assigned-users">
          <Link to="#" onClick={showMembers}>
            {team?.name}
          </Link>
        </div>
      </div>
      {user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleComplete}>
          Mark Complete
        </button>
      )}
    </div>
  );
}
