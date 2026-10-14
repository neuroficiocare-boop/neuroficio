import Link from 'next/link';
export const faqs = [
 { question: 'Can I ask NeuroFicio about robotic gait training or exoskeleton therapy?', answer: 'Yes. Tell our team your mobility goals and ask which assessment, physiotherapy and equipment guidance services are available. This article does not establish that NeuroFicio operates a robotic gait or exoskeleton facility, and we do not book treatment at other centres.' },
 { question: 'Is robotic rehabilitation necessary after a stroke?', answer: 'No. A rehabilitation plan should be based on your needs and practical goals. Devices differ, and robotic equipment is not essential for every patient.' },
 { question: 'Does robotic therapy guarantee that I will walk again?', answer: 'No treatment or device can guarantee walking recovery. Ask your rehabilitation team about realistic goals, risks and alternatives for your situation.' },
 { question: 'When should physiotherapy start after a stroke?', answer: 'Your treating team should decide when you are medically ready and what activity is appropriate. Do not begin unsupervised exercises according to a fixed online timetable.' },
 { question: 'Can I continue stroke rehabilitation at home?', answer: 'Home rehabilitation may be appropriate after assessment of your clinical needs and home environment. Some patients also need hospital, outpatient or other specialist care.' },
 { question: 'Does NeuroFicio provide hospital robotic therapy?', answer: 'This website describes home physiotherapy and remote rehabilitation enquiries. It does not establish that NeuroFicio operates a hospital robotic facility. Ask which specific services and devices are currently available.' },
];
export default function ArticleBody() {
 return <article className="article-body">
 <p className="lead">If you are comparing robotic rehabilitation with physiotherapy after a stroke, start with the activities you want help with: using your hand, getting out of a chair, walking or managing daily life. A device is one possible tool; it is not a recovery plan on its own.</p>
 <nav aria-label="In this guide"><strong>In this guide</strong><ul>
 <li><a href="#robotic-therapy">What robotic therapy involves</a></li><li><a href="#evidence">Evidence and limitations</a></li>
 <li><a href="#home-care">Home and online rehabilitation</a></li><li><a href="#questions">Questions before booking</a></li><li><a href="#faq">Patient FAQs</a></li>
 </ul></nav>
 <h2 id="robotic-therapy">What is robotic neuro rehabilitation?</h2>
 <p>Robotic rehabilitation uses devices that assist or guide movement during practice. Systems may target the arm, hand or walking. Ask which device is proposed, what task it is intended to help with and how a qualified professional will supervise it.</p>
 <p>Robotic equipment, electrical stimulation, video consultations and wearable tracking are different technologies. Evidence about one cannot be assumed to apply to the others. Their suitability must be assessed separately.</p>
 <h2 id="evidence">Does robotic therapy improve stroke recovery?</h2>
 <p>Benefits depend on the intervention and the outcome being measured. Improving strength does not automatically mean greater independence in daily activities. Comparing therapy of similar intensity matters when assessing whether equipment adds benefit.</p>
 <div className="article-callout"><strong>What guidance says:</strong> NICE guideline NG236 does not recommend robot-assisted arm training in upper-limb rehabilitation after stroke. Its evidence review did not establish enough additional functional benefit over similarly intensive physiotherapy. This recommendation concerns arm training; it should not be presented as a finding about every rehabilitation device.</div>
 <p>Ask your clinician about evidence relevant to the particular device and your goals, including limitations, alternatives, cost and how progress would be assessed.</p>
 <h2>What else can a stroke rehabilitation programme include?</h2>
 <p>A programme may combine physiotherapy for movement, occupational therapy for daily activities, speech and language therapy where needed, and support for cognitive or emotional difficulties. The treating team should decide which elements apply.</p>
 <p>Practice should be adapted to current ability, fatigue, safety and clinical precautions. The starting point and activity level require clinical assessment; a general article cannot specify them for you.</p>
 <h2 id="robotic-gait">Robotic gait and exoskeletons: questions for your NeuroFicio assessment</h2>
 <p>Arm rehabilitation, robotic walking devices and wearable exoskeletons are different interventions. The NICE recommendation about robot-assisted arm training should not be applied as a blanket conclusion about every gait device. Ask a specialist what evidence applies to the particular walking system and your needs.</p>
 <p>If you are asking about robotic gait training or an exoskeleton, start by discussing your walking goals with our NeuroFicio team. Ask which physiotherapy and equipment guidance options are currently available, what an assessment would involve and what evidence applies to any proposed intervention. We do not use this website to book you into other robotic therapy facilities.</p>
 <ul><li>What walking goal is the device intended to support?</li><li>How are fit, medical suitability and assistance needs assessed?</li><li>Does the programme include relevant practice outside the device?</li><li>What do assessment, sessions and follow-up cost?</li><li>How will progress be measured and alternatives compared?</li></ul>
 <p>NeuroFicio describes home physiotherapy and remote rehabilitation enquiries. This article does not confirm a NeuroFicio robotic gait or exoskeleton facility, or name unverified clinics as treatment locations.</p>
 <h2 id="home-care">Can rehabilitation happen at home or online?</h2>
 <p>Home care can help address everyday tasks in the environment where you live. Online appointments may be suitable for some reviews, education and supervised practice, while other needs require in-person assessment or treatment.</p>
 <p>NeuroFicio describes home neurological physiotherapy in Hyderabad and accepts remote-care enquiries. Ask about clinical suitability and availability for your country. A video appointment should complement appropriate local care and must not delay urgent assessment.</p>
 <h2 id="questions">Questions to ask before paying for therapy or equipment</h2>
 <ul><li>Which everyday goal is the proposed treatment intended to support?</li><li>What are the professional’s qualifications and relevant experience?</li>
 <li>What evidence supports this intervention for my needs?</li><li>What other options are available?</li><li>How will progress be measured and the plan reviewed?</li>
 <li>What is included in the price, and what costs extra?</li><li>Will I need a caregiver or hands-on local care?</li></ul>
 <div className="article-cta"><h2>Ask about your rehabilitation options</h2><p>Tell the team your location and the broad type of support you need. Confirm assessment eligibility, available services and ongoing fees before booking.</p>
 <Link className="btn btn-primary" href="/contact">Enquire about an assessment</Link><p><Link href="/services">Home rehabilitation</Link> | <Link href="/international">International remote-care enquiries</Link> | <Link href="/equipment">Equipment guidance</Link></p></div>
 <h2 id="faq">Frequently asked questions</h2>{faqs.map(f => <section className="article-faq" key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></section>)}
 <h2>Sources and further reading</h2><ul>
 <li><a href="https://www.nice.org.uk/guidance/ng236/chapter/Recommendations">NICE: Stroke rehabilitation in adults - recommendations</a></li>
 <li><a href="https://www.nice.org.uk/guidance/ng236/chapter/Rationale-and-impact">NICE: Rationale and impact of robot-assisted arm training recommendations</a></li>
 <li><a href="https://www.nhs.uk/conditions/stroke/recovery/">NHS: Recovering from a stroke</a></li>
 <li><a href="https://www.who.int/news-room/fact-sheets/detail/rehabilitation">WHO: Rehabilitation</a></li></ul>
 <div className="article-disclaimer">This guide provides general information and does not replace individual assessment. Recovery outcomes vary. For sudden or worsening neurological symptoms, seek urgent local medical care.</div>
 </article>;
}
