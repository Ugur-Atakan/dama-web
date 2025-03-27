const handleSaveStep1 = () => {
  const data = {
    step: 1,
    section: "marital",
    data: {
      children: [
        {
          name: "Ali",
          birthDate: "22-12-2024",
        },
        {
          name: "Ayşe",
          birthDate: "1-1-2020",
        },
      ],
      spouseName: "Johannes Does",
      hasChildren: true,
      maritalStatus: "married",
    },
  };
};

const handleSaveStep2 = () => {
  const data = {
    step: 2,
    section: "employment",
    data: {
      salary: "123",
      position: "Adam",
      startDate: "123",
      hasContract: true,
      contractFile: "http://exampledosya.acom",
      employerName: "Beter AŞ",
      isContractor: false,
      totalCompensation: "12310",
      isMultiplePayments: false,
    },
  };
};

const handleSaveStep3 = () => {
    const data = {
      step: 3,
      section: "workConditions",
      data: {
        bases: "Bu alan string veri içeriyor",
        dailyHours: "12",
        weeklyDays: "5",
        lastWorkDate: "20-12-2009",
        supervisorName: "Haktan Yakan",
      },
    };
  };

  const handleSaveStep4 = () => {
    const data = {
      step: 4,
      section: "postEmployment",
      data: {
        hasWorked: true,
        lastSalary: "110000 USD",
        previousJobs: [
          {
            company: "ABC Technologies",
            endDate: "2020-08-15",
            startDate: "2019-03-01",
          },
          {
            company: "XYZ Innovations",
            endDate: "2022-12-31",
            startDate: "2020-09-01",
          },
        ],
        currentSalary: "120000 USD",
        currentCompany: "Modern Tech Inc.",
        isCurrentlyWorking: false,
      }
    }
  };
  

  const handleSaveStep5 = () => {
    const data = {
      step: 5,
      section: "evidenceWitness",
      data: {
        witnesses: [
          {
            lastName: "Technologies",
            firstName: "ABC",
          },
          {
            lastName: "Oğuz",
            firstName: "Alper ",
          },
        ],
        hasWitnesses: true,
        evidenceLinks: ["instagmra.com/asdasdas", "youtube.com/daksadksakd"],
      }
    };
  };
  