import { useEffect, useState } from "react";
import Select from "react-select";

// hooks
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";

// styles
import "./MyTeams.css";
import { projectFirestore } from "../../firebase/config";

export default function Dashboard() {
  const { documents: teams, error } = useCollection("teams");
  const { user } = useAuthContext();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamsLeading, setTeamsLeading] = useState([]);
  const [members, setMembers] = useState([]);
  const [kudos, setKudos] = useState("");

  useEffect(() => {
    const teamsLeading = (teams || [])
      .filter((team) => team.members.includes(user.uid))
      .map((team) => ({ ...team, label: team.name, value: team.id }));
    setTeamsLeading(teamsLeading);
  }, [teams]);

  console.log("teams===>>", selectedTeam, "teamsLeading==>>", teamsLeading);

  useEffect(() => {
    if (selectedTeam) {
      (async () => {
        let members =
          (await Promise.all(
            selectedTeam.members?.map((memberId) =>
              projectFirestore.collection("users").doc(memberId).get()
            )
          )) ?? [];
        console.log("fff==>>", members);
        members = members
          .map((member) => ({...member.data(), id: member.id}))
          .map((member) => ({
            ...member,
            value: member.id,
            label: member.displayName,
          }));
        setMembers(members);
      })();
    }
  }, [selectedTeam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('before adding', selectedMember)
      const member = await projectFirestore
        .collection("users")
        .doc(selectedMember.id)
        .collection("kudos")
        .add({ team: selectedTeam.id, message: kudos });
        alert('Kudos added');
        setKudos('');
        setSelectedMember(null);
        setSelectedTeam(null);
        console.log('after adding', member);
    } catch (err) {
        console.log('error adding kudos', err);
    }
  };

  return (
    <div>
      <h2 className="page-title">My Teams</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Select Team:</span>
          <Select
            options={teamsLeading}
            value={selectedTeam}
            onChange={(option) => setSelectedTeam(option)}
          />
        </label>

        <label>
          <span>Select Member:</span>
          <Select
            options={members}
            value={selectedMember}
            onChange={(option) => setSelectedMember(option)}
          />
        </label>

        <label>
          <span>Kudos:</span>
          <textarea
            required
            onChange={(e) => setKudos(e.target.value)}
            value={kudos}
          ></textarea>
        </label>

        <button className="btn">Give Kudos</button>
      </form>
    </div>
  );
}
