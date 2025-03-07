// utils/validateStepData.ts

interface FormData {
    personalDetails?: any;
  }
  
  const validateStepData = (currentStep: number, formData: FormData) => {
    const steps = [
      { label: "Personal Details" }
    ];
  
    const currentStepData = steps[currentStep]; // Get the current step object
    let isValid = true;
    let errors: { [key: string]: string } = {};
  
    switch (currentStepData.label) {
      case "Personal Details":
        console.log("personalDetails Data",formData)
        // if (!formData.personalDetails?.profilePhoto) {
        //   errors.profilePhoto = "Passport-style headshot is required";
        //   isValid = false;
        // }  
        break;
  
      default:
        break;
    }
  
    return { isValid, errors: Object.values(errors).join(", ") };
  };
  
  export default validateStepData;
  