export function useProjectScenario({ setScenario }) {
  function updateProjectField(field, value) {
    setScenario((prev) => {
      const nextProject = {
        ...prev.project,
        [field]: value,
      };

      if (field === "hasParking" && value === false) {
        nextProject.valeurParking = "";
      }

      return {
        ...prev,
        project: nextProject,
      };
    });
  }

  return {
    updateProjectField,
  };
}
