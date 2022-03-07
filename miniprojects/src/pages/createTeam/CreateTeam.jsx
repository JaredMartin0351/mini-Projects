// hooks
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';

import Select from 'react-select';

// styles
import './CreateTeam.css';


export default function Create() {
  const history = useHistory();
  const { addDocument, response } = useFirestore('teams');
  const { documents: allMembers } = useCollection('users');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user } = useAuthContext();

  // form field values
  const [name, setName] = useState('');

  useEffect(() => {
    if (allMembers?.length) {
      const options = allMembers.filter(u => u.id !== user.uid).map((user) => {
        return { value: user.id, label: user.displayName };
      });
      setMembers(options);
    }
  }, [allMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const team = {
      name,
      members: selectedMembers.map(m => m.value).concat(user.uid),
      leader: user.uid
    };

    await addDocument(team);
    console.log('response==>>', response)

    if (!response.error) history.push('/');
  };

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new team</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Team name:</span>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>

        <label>
          <span>Add Team Members:</span>
          <Select
            isMulti
            options={members}
            value={selectedMembers}
            onChange={(option) => setSelectedMembers(option)}
          />
        </label>

        <button className="btn">Create Team</button>
      </form>
    </div>
  );
}
