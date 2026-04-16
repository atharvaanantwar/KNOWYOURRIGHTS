export const domains = [
  'All',
  'Consumer Rights',
  'Labor Law',
  'Property Law',
  'Criminal Law',
  'Constitutional Rights',
  'Cyber Law',
];

export const scenarios = [
  {
    id: 1,
    domain: 'Consumer Rights',
    difficulty: 'easy',
    scenario: 'Rahul purchased a smartphone online for ₹25,000. Within 3 days, the phone stopped working. The seller refuses to replace it, claiming "electronics are non-returnable once opened".',
    question: 'What is Rahul\'s legal right in this situation?',
    options: {
      A: 'He has no rights since electronics are non-returnable',
      B: 'He can demand a replacement or refund within 7 days',
      C: 'He must accept the loss and buy a new phone',
      D: 'He can only get store credit, not a refund',
    },
    correct_answer: 'B',
    explanation: 'Under the Consumer Protection Act 2019, consumers have the right to seek redressal against unfair trade practices. For defective products, consumers can demand replacement, refund, or compensation within a reasonable timeframe.',
    legal_reference: 'Consumer Protection Act 2019 - Section 2(47)',
    xp_reward: 10,
  },
  {
    id: 2,
    domain: 'Consumer Rights',
    difficulty: 'medium',
    scenario: 'A restaurant adds a mandatory "service charge" of 10% to every bill without informing customers beforehand. When questioned, they claim it\'s their policy.',
    question: 'Is this practice legally valid?',
    options: {
      A: 'Yes, restaurants can charge whatever they want',
      B: 'No, service charge must be voluntary and clearly displayed',
      C: 'Only if mentioned in the menu',
      D: 'Yes, but customers can refuse to pay it',
    },
    correct_answer: 'B',
    explanation: 'Service charge is voluntary and cannot be forced upon consumers. The Consumer Affairs Ministry has clarified that customers can refuse to pay service charge if they are not satisfied with the service.',
    legal_reference: 'Consumer Protection Act 2019 - Unfair Trade Practice',
    xp_reward: 25,
  },
  {
    id: 3,
    domain: 'Labor Law',
    difficulty: 'medium',
    scenario: 'Priya works at a tech company. She was asked to work overtime for 3 hours daily for a month without any additional compensation. When she refused, she was threatened with termination.',
    question: 'What does the law say about overtime compensation?',
    options: {
      A: 'Employers can demand overtime without extra pay',
      B: 'Overtime must be paid at double the normal rate',
      C: 'Employees cannot refuse overtime work',
      D: 'Overtime is only applicable to factory workers',
    },
    correct_answer: 'B',
    explanation: 'Under labor laws, any work beyond normal working hours must be compensated at overtime rates, typically double the ordinary wage. Employees cannot be forced to work overtime, and refusal is not grounds for termination.',
    legal_reference: 'Factories Act 1948 / Shops and Establishments Act',
    xp_reward: 25,
  },
  {
    id: 4,
    domain: 'Labor Law',
    difficulty: 'hard',
    scenario: 'A company terminates an employee who has worked for 8 years without providing any reason or notice period. The employee was given only 15 days to leave.',
    question: 'What legal protections does this employee have?',
    options: {
      A: 'None, companies can fire anyone anytime',
      B: 'Entitled to notice period or pay in lieu, and potential reinstatement',
      C: 'Only entitled to 1 month salary as compensation',
      D: 'Can only file a civil suit which takes years',
    },
    correct_answer: 'B',
    explanation: 'Under the Industrial Disputes Act, employees who have completed 240 days of continuous service cannot be terminated without valid reason and proper procedure. They are entitled to notice period, retrenchment compensation, and can challenge wrongful termination.',
    legal_reference: 'Industrial Disputes Act 1947 - Section 25F',
    xp_reward: 50,
  },
  {
    id: 5,
    domain: 'Property Law',
    difficulty: 'easy',
    scenario: 'A tenant has been living in a rented apartment for 2 years. The landlord suddenly demands a 50% increase in rent with only 1 week\'s notice.',
    question: 'Is the landlord\'s demand legally valid?',
    options: {
      A: 'Yes, landlords can increase rent anytime',
      B: 'No, rent increase requires reasonable notice as per agreement',
      C: 'Only if the tenant agrees verbally',
      D: 'Yes, but maximum 10% increase allowed',
    },
    correct_answer: 'B',
    explanation: 'Rent increases must follow the terms of the rental agreement. Typically, landlords must provide 1-3 months notice for any rent increase. Arbitrary increases can be challenged under tenancy laws.',
    legal_reference: 'Rent Control Act / State-specific Tenancy Laws',
    xp_reward: 10,
  },
  {
    id: 6,
    domain: 'Property Law',
    difficulty: 'hard',
    scenario: 'A person buys a property and later discovers that the seller had already mortgaged it to a bank, and the loan is now in default. The bank is claiming the property.',
    question: 'What is the buyer\'s legal position?',
    options: {
      A: 'Buyer loses the property as bank has first claim',
      B: 'Buyer can keep the property if purchase was bona fide and registered',
      C: 'Buyer must pay off the bank loan to keep the property',
      D: 'Only option is to sue the seller for fraud',
    },
    correct_answer: 'B',
    explanation: 'If the buyer purchased the property in good faith, completed due diligence, and the sale was properly registered, they may have valid title. However, this depends on whether the mortgage was registered and if the buyer had notice of it. Legal recourse against the seller for fraud is also available.',
    legal_reference: 'Transfer of Property Act 1882 - Section 41',
    xp_reward: 50,
  },
  {
    id: 7,
    domain: 'Criminal Law',
    difficulty: 'medium',
    scenario: 'A person is arrested by police at 10 PM. The police refuse to inform the family and keep the person in custody overnight without producing them before a magistrate.',
    question: 'What constitutional right is being violated?',
    options: {
      A: 'Only police protocol is violated, not a constitutional right',
      B: 'Right to be informed of grounds of arrest and right to be produced before magistrate within 24 hours',
      C: 'Right to bail is automatic',
      D: 'Only the right to make a phone call',
    },
    correct_answer: 'B',
    explanation: 'Article 22 of the Constitution guarantees the right to be informed of the grounds of arrest, the right to consult a lawyer, and the right to be produced before a magistrate within 24 hours of arrest.',
    legal_reference: 'Constitution of India - Article 22',
    xp_reward: 25,
  },
  {
    id: 8,
    domain: 'Criminal Law',
    difficulty: 'easy',
    scenario: 'A woman files a complaint of domestic violence. The police refuse to register an FIR, saying it\'s a "family matter" that should be resolved privately.',
    question: 'What is the legal position?',
    options: {
      A: 'Police are correct, domestic matters should stay private',
      B: 'Police must register FIR; domestic violence is a cognizable offense',
      C: 'Only family court can handle such matters',
      D: 'The woman must produce witnesses first',
    },
    correct_answer: 'B',
    explanation: 'Domestic violence is a criminal offense under the Protection of Women from Domestic Violence Act. Police are mandated to register complaints and cannot refuse on grounds of it being a "family matter".',
    legal_reference: 'Protection of Women from Domestic Violence Act 2005',
    xp_reward: 10,
  },
  {
    id: 9,
    domain: 'Constitutional Rights',
    difficulty: 'medium',
    scenario: 'A government school denies admission to a child from a marginalized community, citing that the school only admits students from "respectable families".',
    question: 'Which fundamental right is being violated?',
    options: {
      A: 'Only a moral issue, not a legal violation',
      B: 'Right to Equality (Article 14) and Right against Untouchability (Article 17)',
      C: 'Only the Right to Education',
      D: 'Cultural and Educational Rights',
    },
    correct_answer: 'B',
    explanation: 'Article 14 guarantees equality before law, and Article 17 abolishes untouchability. Discrimination based on caste or social status in educational institutions is unconstitutional and illegal.',
    legal_reference: 'Constitution of India - Articles 14, 15, 17',
    xp_reward: 25,
  },
  {
    id: 10,
    domain: 'Constitutional Rights',
    difficulty: 'hard',
    scenario: 'A state government passes an order prohibiting all public gatherings and protests in the capital city indefinitely, citing maintenance of public order.',
    question: 'Is this order constitutionally valid?',
    options: {
      A: 'Yes, government has absolute power to maintain order',
      B: 'No, it violates the fundamental right to peaceful assembly under reasonable restrictions',
      C: 'Valid only during emergency declaration',
      D: 'Only political parties can challenge this',
    },
    correct_answer: 'B',
    explanation: 'While the state can impose reasonable restrictions on the right to assembly (Article 19(1)(b)) for public order, a blanket ban on all public gatherings indefinitely is disproportionate and unconstitutional.',
    legal_reference: 'Constitution of India - Article 19(1)(b) and 19(3)',
    xp_reward: 50,
  },
  {
    id: 11,
    domain: 'Cyber Law',
    difficulty: 'easy',
    scenario: 'Someone discovers that their private photos have been shared on social media without their consent by an ex-partner.',
    question: 'What legal recourse is available?',
    options: {
      A: 'Nothing can be done once photos are online',
      B: 'Can file complaint under IT Act for violation of privacy and seek removal',
      C: 'Only option is to contact social media platform',
      D: 'Must pay to get them removed',
    },
    correct_answer: 'B',
    explanation: 'Sharing private content without consent is an offense under the IT Act. Victims can file complaints with cyber police, seek removal of content, and pursue criminal charges against the perpetrator.',
    legal_reference: 'Information Technology Act 2000 - Section 66E, 67',
    xp_reward: 10,
  },
  {
    id: 12,
    domain: 'Cyber Law',
    difficulty: 'medium',
    scenario: 'An e-commerce company stores customer data including credit card information. Their database is hacked, exposing thousands of customers\' financial data.',
    question: 'What is the company\'s legal liability?',
    options: {
      A: 'No liability as hacking is a criminal act by third parties',
      B: 'Company is liable for failure to implement reasonable security practices',
      C: 'Only liable if customers suffer actual financial loss',
      D: 'Only government can take action, not individuals',
    },
    correct_answer: 'B',
    explanation: 'Under the IT Act and SPDI Rules, companies handling sensitive personal data must implement reasonable security practices. Failure to protect data makes them liable for compensation and penalties.',
    legal_reference: 'IT Act 2000 - Section 43A, SPDI Rules 2011',
    xp_reward: 25,
  },
  {
    id: 13,
    domain: 'Consumer Rights',
    difficulty: 'hard',
    scenario: 'A pharmaceutical company markets a drug without disclosing known serious side effects. Several patients suffer adverse reactions.',
    question: 'What legal actions can affected patients take?',
    options: {
      A: 'Nothing, all drugs have side effects',
      B: 'Can sue for product liability, claim compensation, and file criminal complaint',
      C: 'Can only complain to drug controller',
      D: 'Must prove intent to harm for any action',
    },
    correct_answer: 'B',
    explanation: 'Under the Consumer Protection Act 2019, manufacturers are strictly liable for defective products. Patients can claim compensation for product liability, and the company may face criminal action for negligence.',
    legal_reference: 'Consumer Protection Act 2019 - Product Liability (Chapter VI)',
    xp_reward: 50,
  },
  {
    id: 14,
    domain: 'Labor Law',
    difficulty: 'easy',
    scenario: 'An employee is forced to work 7 days a week without any weekly off for 3 months.',
    question: 'Is this practice legal?',
    options: {
      A: 'Yes, if mentioned in employment contract',
      B: 'No, every employee is entitled to at least one weekly rest day',
      C: 'Only illegal if overtime is not paid',
      D: 'Legal for private sector employees',
    },
    correct_answer: 'B',
    explanation: 'Labor laws mandate at least one weekly rest day for all employees. Continuous work without weekly rest is illegal and employees can complain to labor authorities.',
    legal_reference: 'Shops and Establishments Act / Factories Act 1948',
    xp_reward: 10,
  },
  {
    id: 15,
    domain: 'Cyber Law',
    difficulty: 'hard',
    scenario: 'A person creates a fake social media profile impersonating a celebrity and posts defamatory content, causing reputational damage.',
    question: 'What offenses have been committed?',
    options: {
      A: 'Only terms of service violation',
      B: 'Identity theft, impersonation, and defamation - all criminal offenses',
      C: 'Only civil defamation applies',
      D: 'Celebrity has no legal recourse against anonymous accounts',
    },
    correct_answer: 'B',
    explanation: 'Impersonation and identity theft are offenses under the IT Act. Defamation (criminal and civil) also applies. The victim can file criminal complaints and civil suits for damages.',
    legal_reference: 'IT Act 2000 - Section 66C, 66D, IPC Section 499, 500',
    xp_reward: 50,
  },
];

export const getRandomScenario = (domain = 'All', difficulty = 'All', excludeIds = []) => {
  let filtered = scenarios;
  
  if (domain !== 'All') {
    filtered = scenarios.filter(s => s.domain === domain);
  }
  
  if (difficulty !== 'All') {
    filtered = filtered.filter(s => s.difficulty === difficulty);
  }
  
  filtered = filtered.filter(s => !excludeIds.includes(s.id));
  
  if (filtered.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

export const getScenariosByDifficulty = (difficulty) => {
  return scenarios.filter(s => s.difficulty === difficulty);
};

export default scenarios;
