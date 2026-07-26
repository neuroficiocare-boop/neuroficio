import Link from 'next/link';

const TECHNIQUES = [
  {
    title: 'Movement & Mobility Exercises',
    body: 'Focus on improving range of motion and flexibility of joints and muscles, helping stroke survivors regain the ability to move freely and comfortably.',
  },
  {
    title: 'Strengthening Exercises',
    body: 'Help rebuild muscle mass and strength often diminished after a stroke, improving overall physical stability and functionality.',
  },
  {
    title: 'Balance & Coordination Training',
    body: 'Essential for preventing falls and improving the ability to perform daily activities safely, while refining fine motor skills and hand-eye coordination.',
  },
  {
    title: 'Functional Electrical Stimulation',
    body: 'Uses electrical currents to stimulate muscle contractions, particularly beneficial for individuals with severe muscle weakness or paralysis.',
  },
];

const PROGRAM_TABLE = [
  { component: 'Technology-Guided Practice', role: 'Wearable motion-tracking and tele-rehab platforms that keep structured movement training going between home visits.' },
  { component: 'Manual Physiotherapy', role: 'Targeted mobility, strengthening, balance and coordination exercises tailored to the individual.' },
  { component: 'Functional Electrical Stimulation', role: 'Supports muscle contraction in cases of severe weakness or paralysis, guided by your therapist.' },
  { component: 'Occupational Therapy (Complementary)', role: 'Helps stroke survivors regain independence in daily activities, complementing physiotherapy.' },
  { component: 'Speech Therapy (Complementary)', role: 'Crucial for stroke survivors with communication difficulties, improving speech, language and swallowing.' },
  { component: 'Psychological & Community Support', role: 'Emotional support and moderated peer groups to help survivors and caregivers cope with the challenges of recovery.' },
];

const WHY_NEUROFICIO = [
  'Home care is our primary model, not an add-on service',
  'Specialists exclusively in neurological conditions',
  'Technology tools prescribed and guided by our clinical team, never sold as a gadget',
  'Online support groups moderated by specialists, not volunteers',
  'International remote consultation for diaspora families',
  'First assessment and first therapy session completely free',
];

export const faqs = [
  {
    question: 'How soon should physiotherapy start after a stroke?',
    answer: 'Physiotherapy should begin as soon as possible after a stroke, ideally within 24-48 hours, to maximize recovery potential.',
  },
  {
    question: 'Can physiotherapy completely cure stroke-related disabilities?',
    answer: 'While physiotherapy can significantly improve function and quality of life, it may not completely cure all stroke-related disabilities.',
  },
  {
    question: 'How long does stroke rehabilitation take?',
    answer: 'Stroke rehabilitation is a long-term process that can take months to years, depending on the severity of the stroke and individual progress.',
  },
  {
    question: 'What is the role of family in stroke recovery?',
    answer: 'Family plays a crucial role in providing emotional support, encouragement, and assistance with daily activities, greatly influencing recovery outcomes.',
  },
  {
    question: 'Are there any risks associated with physiotherapy for stroke survivors?',
    answer: "Physiotherapy is generally safe, but it's important to follow the guidance of a trained professional to avoid any potential risks or complications.",
  },
];

export default function ArticleBody() {
  return (
    <div className="article-body">
      <p className="lead">
        For decades, stroke and paralysis rehabilitation looked largely the same — a therapist, a mat, and a
        set of manual exercises repeated session after session. That&apos;s changing. As robotics and
        rehabilitation technology mature, <strong>robotic-assisted neuro-rehabilitation</strong> has become one
        of the most searched and most promising developments in recovery care, offering a level of precision
        and repetition manual therapy alone can struggle to match.
      </p>

      <p>
        This guide explains how robotic-assisted therapy fits into stroke and paralysis recovery, what a modern
        neuro-rehab program should include, and how that thinking shapes the technology-guided, home-based care
        model at Neuroficio in Hyderabad.
      </p>

      <h2>What Happens During a Stroke</h2>
      <p>
        A stroke occurs when the blood supply to part of the brain is interrupted or reduced, preventing brain
        tissue from getting enough oxygen and nutrients. Brain cells begin to die within minutes, leading to
        potentially severe physical and cognitive impairments. There are two main types: ischaemic strokes, the
        most common type, caused by blockages or narrowing of the arteries leading to the brain, and
        haemorrhagic strokes, which occur when a blood vessel in the brain bursts, causing bleeding within or
        around the brain.
      </p>

      <h2>Why Physiotherapy Matters So Much After a Stroke</h2>
      <p>
        Physiotherapy, also known as physical therapy, involves the use of exercise, movement, and manual
        therapy to restore function and movement in individuals affected by injury or illness. In stroke
        recovery specifically, physiotherapy plays a vital role by helping to rebuild strength, coordination,
        and mobility — through targeted exercises and treatments, physiotherapists can address the specific
        deficits caused by a stroke.
      </p>

      <div className="article-callout">
        <strong>Timing matters:</strong> physiotherapy should begin as soon as possible after a stroke, ideally
        within 24-48 hours, to maximize recovery potential — one of the clearest, most consistent pieces of
        guidance in stroke rehabilitation.
      </div>

      <h2>Core Physiotherapy Techniques in Stroke Recovery</h2>
      <div className="article-technique-grid">
        {TECHNIQUES.map((t) => (
          <div className="article-technique" key={t.title}>
            <strong>{t.title}</strong>
            <span>{t.body}</span>
          </div>
        ))}
      </div>

      <h2>Where Robotic-Assisted Therapy Fits Into Modern Recovery</h2>
      <p>
        The field of physiotherapy is continuously evolving, with new tools being developed to enhance stroke
        recovery — including robotic-assisted systems, virtual reality, and wearable tracking technology.
        Robotic-assisted devices, used in specialised clinical settings, are designed to provide highly
        consistent, repeatable movement patterns — something that&apos;s difficult to replicate manually,
        session after session, especially for patients needing intensive, high-repetition therapy.
      </p>
      <p>
        For most patients recovering at home, the more accessible version of this same shift shows up as
        wearable motion-tracking devices and tele-rehab platforms — tools that quantify movement quality
        between visits and keep structured practice going every day, not just on the days a therapist is in the
        room. That&apos;s the thinking behind Neuroficio&apos;s Technology-Guided Recovery pillar: our clinical
        team prescribes and supervises the use of home-appropriate devices, so <strong>technology
        doesn&apos;t replace the therapist — it extends the therapy</strong>.
      </p>

      <h2>A Comprehensive Neuro-Rehabilitation Program</h2>
      <p>A well-designed recovery program rarely relies on one technique alone. It typically brings together:</p>
      <table className="article-table">
        <tbody>
          <tr><th>Component</th><th>Role in Recovery</th></tr>
          {PROGRAM_TABLE.map((row) => (
            <tr key={row.component}>
              <td>{row.component}</td>
              <td>{row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Customised Treatment: Why One Plan Doesn&apos;t Fit All</h2>
      <p>
        A comprehensive assessment is conducted to evaluate each individual&apos;s specific needs and
        limitations, which guides the development of a personalised treatment plan. Based on this assessment,
        physiotherapists create customised exercise programs that target the areas most affected by the stroke
        — and these programs are regularly updated to reflect progress and changing needs, rather than staying
        static throughout recovery.
      </p>

      <div className="article-callout">
        <strong>Recovery is a marathon, not a sprint:</strong> patience, motivation, and continuous encouragement
        from family and friends are vital. Family plays a crucial role in providing emotional support,
        encouragement, and assistance with daily activities, greatly influencing recovery outcomes.
      </div>

      <h2>Beyond Stroke: A Broader Neuro &amp; Movement Rehabilitation Range</h2>
      <p>
        This same technology-guided, home-based approach applies to a wide range of conditions beyond stroke
        alone, including traumatic brain injury, spinal cord injury, and Parkinson&apos;s — the four condition
        groups Neuroficio&apos;s specialists focus on exclusively, rather than treating every diagnosis
        generally.
      </p>

      <h2>About Neuroficio</h2>
      <p>
        Neuroficio is a specialist neurological rehabilitation service operating under Therapy Partners in
        Hyderabad, built on three pillars: home-based care delivered by trained neuro specialists,
        technology-guided rehabilitation tools prescribed by the clinical team, and continuous online support
        for patients and caregivers. Rather than a hospital-based robotic facility, Neuroficio brings
        specialist-guided, technology-supported recovery directly into the home — including for international
        diaspora families managing a loved one&apos;s recovery remotely.
      </p>

      <h2>Why Families Choose Neuroficio</h2>
      <ul>
        {WHY_NEUROFICIO.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>What Patients Say</h2>
      <div className="article-quote">
        &quot;Within two weeks of starting home sessions, my father could stand at the kitchen counter for the
        first time since his stroke. The therapist treated him like a person rebuilding a life, not a patient
        ticking off exercises.&quot;
        <strong>— Family member of a stroke recovery patient</strong>
      </div>
      <div className="article-quote">
        &quot;The structured, technology-guided programme and the clear weekly goals made all the difference —
        I could actually see the progress, not just feel it.&quot;
        <strong>— Patient, mobility recovery programme</strong>
      </div>

      <h2>Getting Started: The Simple 3-Step Process</h2>
      <ol>
        <li><strong>Book your free assessment.</strong> A specialist visits your home — or joins by video call for remote and international patients — no cost, no commitment.</li>
        <li><strong>Get your free first session.</strong> Your therapist delivers a hands-on, structured first session on the same visit, tailored to your assessment findings.</li>
        <li><strong>Begin your programme.</strong> Ongoing home sessions, technology-guided practice between visits, and access to moderated support groups keep recovery active every day.</li>
      </ol>

      <div className="article-cta">
        <h3>Ready to explore technology-guided neuro-rehabilitation at home?</h3>
        <p>Book a free assessment with Neuroficio&apos;s specialists — combining home-based physiotherapy,
        technology-guided practice, and community support for stroke, paralysis, and movement disorder recovery.</p>
        <Link className="btn btn-primary" href="/#contact">Book your free assessment →</Link>
      </div>

      <h2>Frequently Asked Questions</h2>
      {faqs.map((f) => (
        <div className="article-faq" key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </div>
      ))}

      <h2>Final Thoughts</h2>
      <p>
        Stroke and paralysis recovery has never been a one-size-fits-all process, and the rise of
        robotic-assisted and technology-guided therapy alongside traditional physiotherapy reflects how much
        the field has evolved — giving patients access to more consistent, technology-supported movement
        training than manual therapy alone can provide. Technology still works best as part of a broader plan:
        manual physiotherapy, functional electrical stimulation, occupational and speech therapy, and genuine
        family support all remain essential parts of the picture.
      </p>
      <p>
        With home-based specialist care, technology-guided recovery tools, and personalised, regularly-updated
        treatment plans, Neuroficio offers stroke, paralysis, and movement disorder patients in Hyderabad — and
        internationally by video — a comprehensive path toward recovery, starting with a free assessment.
      </p>

      <div className="article-disclaimer">
        <strong>Medical Disclaimer:</strong> This article is for general informational purposes only and is not
        a substitute for professional medical advice, diagnosis, or treatment. Recovery outcomes vary by
        individual, and physiotherapy, including technology-guided therapy, may not completely resolve all
        stroke or paralysis-related disabilities. Always consult a qualified physician or physiotherapist to
        determine the right treatment approach for your specific condition.
      </div>
    </div>
  );
}
