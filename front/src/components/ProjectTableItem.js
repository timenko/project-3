import '../styles/projects.css';
import '../styles/fonts.css';
import inProgress from '../images/in-progress-project-status.svg';
import completed from '../images/complete-project-status.svg';
import todo from '../images/new-project-status.svg';

const ProjectTableItem = ({ id, name, description, requirements, status, setEditProject, setProjectInfo }) => {
    
    const handleEdit = () => {
        setEditProject(true)
        setProjectInfo({
            projectName: name,
            projectDescription: description,
            projectRequirements: requirements,
            projectId: id,
            projectStatus: status
        })
    }

    return (
        <div className="signedMain_item-list__element signedMain_table__name">
            <div className="signedMain_item-list__element-name signedMain_table__name-item-first"><p className="signedMain_text-field">{name}</p></div>
            <div className="signedMain_item-list__element-status signedMain_table__name-item-second">
                <img src={status==='todo' ? todo : (status==='inProgress' ? inProgress : completed)} alt="" />
            </div>
            <div className="signedMain_edit-btn">
                <button className="signedMain_fill-edit-btn" onClick={handleEdit}>Редактировать</button>
            </div>
        </div>
    )
}

export default ProjectTableItem;