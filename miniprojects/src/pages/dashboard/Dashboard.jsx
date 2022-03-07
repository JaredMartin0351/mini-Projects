// components
import ProjectFilter from "./ProjectFilter";
import ProjectList from "../../components/ProjectList";

// hooks
import { useCollection } from "../../hooks/useCollection";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

// styles
import "./Dashboard.css";
import { projectFirestore } from "../../firebase/config";

export default function Dashboard() {
  const { documents, error } = useCollection("projects");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const { user } = useAuthContext();

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  useEffect(() => {
    if (documents?.length) {
      (async () => {
        const projs = await Promise.all(
          documents.map(async (proj) => {
            const team = (
              await projectFirestore.collection("teams").doc(proj.team).get()
            ).data();
            return { ...proj, team };
          })
        );
        setProjects(projs);
      })();
    }
  }, [documents]);

  const filteredProjects = projects.filter((project) => {
    switch (currentFilter) {
      case "all":
        return true;
      case "completed":
        return project.completed;
      case "mine":
        return project.team.members.includes(user.uid);
      case "development":
      case "design":
      case "sales":
      case "marketing":
        return project.category === currentFilter;
      default:
        return false;
    }
  });

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {filteredProjects?.length ? (
        <ProjectList
          projects={filteredProjects}
          currentFilter={currentFilter}
        />
      ) : (
        ""
      )}
    </div>
  );
}
