import { useState} from 'react';
import LanguageSelector from '../../components/LanguageSelector';
import WhatsAppAuth from './components/WhatsAppAuth';
import MaritalStatus from './components/MaritalStatus';
import EmploymentInfo from './components/EmploymentInfo';
import WorkConditions from './components/WorkConditions';
import PostEmployment from './components/PostEmployment';
import EvidenceWitness from './components/EvidenceWitness';
import Summary from './components/Summary';
import SubmissionComplete from './components/SubmissionComplete';


export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState<
    | 'language'
    | 'auth'
    | 'marital'
    | 'employment'
    | 'workConditions'
    | 'postEmployment'
    | 'evidenceWitness'
    | 'summary'
    | 'complete'
  >('language');
    
  const handleBack = () => {
    switch (currentStep) {
      case 'auth':
        setCurrentStep('language');
        break;
      case 'marital':
        setCurrentStep('auth');
        break;
      case 'employment':
        setCurrentStep('marital');
        break;
      case 'workConditions':
        setCurrentStep('employment');
        break;
      case 'postEmployment':
        setCurrentStep('workConditions');
        break;
      case 'evidenceWitness':
        setCurrentStep('postEmployment');
        break;
      case 'summary':
        setCurrentStep('evidenceWitness');
        break;
    }
  };

  if (currentStep === 'language') {
    return <LanguageSelector onContinue={() => setCurrentStep('auth')} />;
  }

  if (currentStep === 'auth') {
    return <WhatsAppAuth onComplete={() => setCurrentStep('marital')} onBack={handleBack} />;
  }

  if (currentStep === 'marital') {
    return <MaritalStatus onComplete={() => setCurrentStep('employment')} onBack={handleBack} />;
  }

  if (currentStep === 'employment') {
    return <EmploymentInfo onComplete={() => setCurrentStep('workConditions')} onBack={handleBack} />;
  }

  if (currentStep === 'workConditions') {
    return <WorkConditions onComplete={() => setCurrentStep('postEmployment')} onBack={handleBack} />;
  }

  if (currentStep === 'postEmployment') {
    return <PostEmployment onComplete={() => setCurrentStep('evidenceWitness')} onBack={handleBack} />;
  }

  if (currentStep === 'evidenceWitness') {
    return <EvidenceWitness onComplete={() => setCurrentStep('summary')} onBack={handleBack} />;
  }

  if (currentStep === 'summary') {
    return <Summary onComplete={() => setCurrentStep('complete')} onEdit={(step) => setCurrentStep(step)} onBack={handleBack} />;
  }

  return <SubmissionComplete />;
}
