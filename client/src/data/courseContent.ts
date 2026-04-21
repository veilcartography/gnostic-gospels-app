// Real course content pulled from Google Drive — Tracie Walker's Gnostic materials

export interface Lesson {
  id: string;
  title: string;
  content: string; // markdown-compatible rich text
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: "sophia-cosmology",
    title: "The Gnostic Sophia Cosmology",
    subtitle: "Sophia & the Sacred Feminine",
    description:
      "A complete thematic study of Gnostic cosmology — from the Plērōma and the fall of Sophia, to the Demiurge, the Archons, and the path of liberation through gnosis.",
    icon: "☽",
    color: "oklch(0.72 0.10 300)",
    lessons: [
      {
        id: "sophia-1",
        title: "Gnostic Cosmology",
        content: `## Gnostic Cosmology

Before matter existed — before the physical universe took form — the Gnostic texts describe a cosmological event absent from orthodox Christian teachings.

In the **Apocryphon of John**, the cosmos begins in the **Plērōma** — the fullness of divine consciousness — where emanations called **Aeons** exist in radiant harmony.

Each Aeon is an expression of the unknowable Source, forming a fractal hierarchy of divine attributes. The texts list these emanations precisely: the Father, Mother (Barbelo), the Self-Generated Son, the Autogenes, and the four luminaries. These Aeons are not mythic characters but **states of consciousness** mapping the structure of reality.

> The material cosmos you experience is a shadow projection of these higher realms.

Gnostic groups in Alexandria, Syria, and Rome worked with this cosmology as esoteric knowledge, not religion. They believed humans move between realms of consciousness, descending through planetary spheres, entering matter, and later ascending back toward the Plērōma.`,
      },
      {
        id: "sophia-2",
        title: "Sophia: Origin, Fall & Independent Creation",
        content: `## Sophia: Origin, Fall & Independent Creation

Sophia, the youngest Aeon, stands at the outermost boundary of divine emanation. Unlike other Aeon pairs — united in masculine-feminine balance — Sophia feels an intense desire to create independently.

Her exact thought is recorded:

> *"I want to produce a work by myself, without my consort."*

This act breaks the cosmic pattern of balanced creation. She provides the formative, receptive principle without the active, ordering masculine principle. The result is an unbalanced creation:

- Raw power without structure
- Divine energy without wisdom
- An emanation cut off from its source

Sophia immediately recognises that something has gone wrong. She withdraws into her light in horror and repentance, becoming **Sophia Achamoth** — the fallen Sophia trapped in the lower realms.

Her grief echoes through the entire cosmos and is mirrored in human experience: the sense that *"you do not belong here,"* the ache of exile, the longing for home.`,
      },
      {
        id: "sophia-3",
        title: "The Demiurge & the Archons",
        content: `## The Demiurge & the Archons

Sophia's independent creation births **Yaldabaoth**, a being described as having:
- The head of a lion
- The body of a serpent
- Eyes like lightning

He inherits divine creative power but lacks wisdom. He declares:

> *"I am God and there is no other beside me."*

This ignorance — not moral evil — leads him to construct the material universe as a reflection of his distorted understanding.

### The Seven Archons

Yaldabaoth creates seven planetary rulers who stamp the descending soul with qualities:

| Archon | Planet | Quality Imposed |
|---|---|---|
| Athoth | Saturn | Melancholy |
| Harmas | Jupiter | Pride |
| Kalila-Umbri | Mars | Aggression |
| Yabel | Sun | Vanity |
| Adonaiou | Venus | Desire |
| Cain | Mercury | Cunning |
| Abel | Moon | Instability |

Gnostic practices — planetary invocations, passwords, and seals — were used to navigate these zones both in life and after death.`,
      },
      {
        id: "sophia-4",
        title: "Human Construction & Archonic Influence",
        content: `## Human Construction & Archonic Influence

When the archons glimpse the reflection of the true **Anthropos** (divine human), they attempt to replicate it. They create Adam in seven layers:

1. Bone body
2. Sinew body
3. Flesh body
4. Marrow body
5. Blood body
6. Skin body
7. Hair body

But the body remains inanimate. **The archons cannot give consciousness.**

The higher Aeons trick Yaldabaoth into breathing life into Adam — and in doing so, he exhaled Sophia's stolen light. Thus humanity contains **divine spark trapped in material form**.

The archons, realising their mistake, cast Adam into a trance of spiritual sleep and create Eve by dividing the androgynous human being, forming sexual polarity as a mechanism of control.

> Paradise, in Gnostic reading, is not a blessing but a beautiful prison — giving pleasure but restricting knowledge.

The serpent is not evil but **Christ-Consciousness awakening humanity**: *"Your eyes shall be opened."*

Once awakened, Adam and Eve become ungovernable, and the archons cast them into denser matter and impose suffering as control mechanisms — not punishment.`,
      },
      {
        id: "sophia-5",
        title: "Practices for Liberation",
        content: `## Practices for Liberation

Gnostic practice is experimental and consciousness-based. Techniques include:

**Standing Prayer**
Arms raised, eyes open — observing the body without identifying with it.

**Pneumatic Prayer**
Silent inner communion with the divine spark rather than petitioning an external god.

**Fasting**
To demonstrate that consciousness is not ruled by bodily cravings.

**Sexual Conduct**
Sexual energy is creative power — the same Sophia used. Gnostics used either conservation (celibacy) or conscious transgression (libertine rites). Both aimed at mastery of the creative force, not moral purity.

**Conscious Eating**
Recognising matter as condensed light, transforming archonic food into pneumatic nourishment.

**Thought Observation**
Detecting archonic thought-insertion — urges, fears, impulses not arising from the higher self.

**Heart-Centre Invocation**
Focusing on the inner light and invoking Sophia:

> *"Sophia, I remember."*`,
      },
      {
        id: "sophia-6",
        title: "Ascension & the Five Seals",
        content: `## Ascension & the Five Seals

The soul must traverse the same planetary spheres consciously at death. Gnostic texts provide passwords, sigils, names of power, and declarations of origin.

The awakened can say:

> *"I know my origin and I am not your slave."*

### The Five Seals

1. **Recognition of imprisonment** — seeing the material world for what it is
2. **Activation of the divine spark** — awakening the Pneumatic body
3. **Conscious operation of the body** — mastering physical existence
4. **Mastery over planetary powers** — passing the archonic gates
5. **Restoration to the Plērōma** — return to the divine fullness

Most complete the process over many lifetimes.`,
      },
      {
        id: "sophia-7",
        title: "Bloodlines & Consciousness Types",
        content: `## Bloodlines & Consciousness Types

The Apocryphon of John distinguishes three human types:

| Type | Description |
|---|---|
| **Hylic** | Almost entirely governed by matter; the spark is dormant or absent |
| **Psychic** | Soul is active but the divine spark remains dormant |
| **Pneumatic** | Divine spark is ready to awaken; capable of gnosis |

The archons attempt to corrupt the divine lineage through their interference with Eve. Yet Gnosticism teaches:

> *Gnosis can awaken in anyone regardless of lineage.*

This is a radical teaching — liberation is not reserved for a chosen bloodline but is available to any soul that awakens.`,
      },
      {
        id: "sophia-8",
        title: "Modern Implications",
        content: `## Modern Implications

The Gnostic view sees nearly all human institutions as **archonic systems**:

- Economic hierarchies
- Political authority
- Religious dogma
- Media and entertainment
- Social conditioning

*"Being in the world but not of it"* means engaging without identifying.

One must develop:
- Equanimity
- Clarity
- Compassion
- Conscious choice
- Independence from external validation

> Archonic interference **increases** as one awakens — a sign of progress, not failure.

This reframe is central to Gnostic psychology: the more you awaken, the more resistance you encounter. This is not a sign that you are doing something wrong — it is a sign that the system is responding to your liberation.`,
      },
      {
        id: "sophia-9",
        title: "Practical Exercises for Awakening",
        content: `## Practical Exercises for Awakening

These are the core daily and weekly practices drawn from Gnostic tradition:

**Daily Practices**
- Daily heart-centre meditation
- Observing thoughts as external broadcasts (not your own)
- Conscious breathwork
- Awareness of planetary influences on mood and behaviour

**Weekly Practices**
- Weekly fasting (one day)
- Conscious sexual conduct
- Study of original Gnostic texts

**Community Practices**
- Participation in small, egalitarian communities
- Re-reading scripture through a pneumatic (liberating) perspective

The goal is not religious observance but **experimental verification** — you test each teaching against your own inner experience.`,
      },
      {
        id: "sophia-10",
        title: "Summary of Core Teachings",
        content: `## Summary of Core Teachings

This is the foundation of the Gnostic worldview:

1. **Reality is structured in emanations from the divine** — the Plērōma is the source of all consciousness.
2. **Sophia's independent creation produced the Demiurge** — an ignorant creator god who built the material world.
3. **The material cosmos is a control system** built by ignorant powers, not a divine gift.
4. **Humanity contains the light Sophia lost** — the divine spark is within every human being.
5. **Awakening (gnosis) is remembering divine origin** — not belief, but direct inner knowledge.
6. **Liberation comes through inner recognition, not belief** — no external authority can grant gnosis.
7. **Every awakened being contributes to Sophia's restoration** — your liberation is part of a cosmic healing.

> The path is personal, experiential, and requires persistence.

You have now completed the Gnostic Sophia Cosmology course. The Oracle awaits your questions.`,
      },
    ],
  },
  {
    id: "initiatory-training",
    title: "Initiatory Gnostic Training",
    subtitle: "The Inner Curriculum",
    description:
      "The complete Manual 2 of the Initiatory Gnostic Training path — covering purification rites, Sophia invocation, the Seven Gates and their passwords, and full gatework rituals.",
    icon: "✦",
    color: "oklch(0.75 0.12 80)",
    lessons: [
      {
        id: "init-1",
        title: "The Nature of Initiation",
        content: `## The Nature of Initiation

Initiation is not a ceremony performed for you. It is a shift that happens **within you**.

In Gnostic terms, initiation is:
- The spark remembering itself
- The subtle body awakening
- The archonic layers loosening
- The inner Sophia rising
- The Pneumatic identity stabilising

> You are not becoming something new. You are uncovering what has always been there.

### The Three Bodies of Initiation

Gnostic initiation works on three levels:

**1. The Physical Body** — breath, posture, sensation, presence

**2. The Psychic Body** — emotion, memory, identity, thought

**3. The Pneumatic Body** — spark, subtle light, inner Sophia, divine remembrance

Manual 1 trained the first two. **Manual 2 activates the third.**

### The Role of Sophia in Initiation

Sophia is not a mythic figure in this work — she is the living intelligence within you that guides the ascent. She is:
- The ache of exile
- The pull toward truth
- The inner voice that whispers *"remember"*
- The light that stirs when you meditate
- The clarity that appears when you release illusion

Initiation is the process of reuniting with her.

### How to Approach Initiatory Work

Move slowly. Move reverently. Move with presence.

Initiation is not rushed — it unfolds. You are not forcing an experience. You are allowing one.`,
      },
      {
        id: "init-2",
        title: "Preparatory Purification Rites",
        content: `## Preparatory Purification Rites

Initiation requires a different inner state than daily practice. You are not just observing thoughts — you are preparing to cross thresholds.

Purification clears: emotional residue, archonic influence, psychic noise, and energetic stagnation. It creates a clean inner chamber where Sophia can rise.

---

### Rite of Breath Purification (Expanded Version)

This is the full initiatory version of the breathwork.

1. Stand or sit upright
2. Inhale slowly through the nose
3. Hold the breath
4. Recite inwardly: **"ZAMA ZAMA ŌZZA RACHAMA ŌZAI."**
5. Exhale sharply through the mouth
6. Repeat 7 times

*Purpose: This sequence vibrates the subtle body and clears the psychic field.*

---

### Rite of Water (Inner Cleansing)

This is not literal water — it is awareness flowing through the body.

1. Sit comfortably
2. Visualise a stream of clear water descending from above your head
3. Let it flow through: mind → throat → heart → belly → pelvis → legs
4. Let it exit through the feet
5. Repeat 3 cycles

*Purpose: To dissolve emotional residue and prepare the heart for invocation.*

---

### Rite of Fire (Spark Activation)

1. Place your hand on your heart
2. Inhale deeply
3. On the exhale, speak inwardly: **"The fire becomes light within me."**
4. Repeat 12 times

*Purpose: To activate the inner Sophia-spark.*

---

### Rite of Stillness (Threshold Preparation)

1. Sit in silence
2. Let the breath settle
3. Let the mind soften
4. Let the heart open
5. Remain for 3–5 minutes

*Purpose: To enter the initiatory state — quiet, receptive, luminous.*`,
      },
      {
        id: "init-3",
        title: "Invocation of Sophia",
        content: `## Invocation of Sophia

Sophia is not distant. She is the inner guide, the intelligence of the spark.

> Invocation is not worship — it is alignment. You are calling forth the part of you that remembers.

---

### The Threefold Sophia Invocation

This is the foundational invocation used throughout initiatory work.

**Step 1 — Heart Awakening**
Place your hand on your chest. Speak inwardly:
> *"Sophia, I remember."*

**Step 2 — Light Descent**
Visualise a soft, white-gold light descending from above your head into your heart.

**Step 3 — Union**
Speak inwardly:
> *"Mother of my spark, rise within me."*

*Purpose: To awaken the Pneumatic body and establish connection with Sophia.*

---

### The Whisper Invocation (Subtle Contact)

Used when you need guidance or clarity.

1. Sit quietly
2. Breathe gently
3. Whisper inwardly: *"Sophia, guide me."*
4. Wait
5. Listen for the subtle response

*Purpose: To receive intuitive insight.*

---

### The Full Sophia Invocation (Ceremonial)

Used before gatework or Seal activation.

1. Stand with arms slightly open
2. Inhale deeply
3. Speak aloud or inwardly:

> *"Holy Sophia,*
> *Light of the Plērōma,*
> *Mother of my spark,*
> *Guide of my ascent,*
> *Rise within me."*

4. Visualise your heart igniting with white-gold fire.

*Purpose: To fully activate the Pneumatic body.*`,
      },
      {
        id: "init-4",
        title: "The Seven Gates & Their Guardians",
        content: `## The Seven Gates & Their Guardians

Each archon rules a gate — a layer of consciousness you must pass through. These gates are not places. They are **states of mind and emotion**.

Passing a gate means dissolving the archon's influence. It is not defeating it — it is **seeing through it**.

---

### The Seven Gates

**Gate 1 — Athoth (Saturn)**
Threshold: heaviness, despair
Lesson: endurance
Password: *"ZŌRA ZŌRA ZŌRA NACHAMA ANACHAMA."*

---

**Gate 2 — Harmas (Jupiter)**
Threshold: pride, inflation
Lesson: humility
Password: *"I am of the Light of the Living Father."*

---

**Gate 3 — Kalila-Oumbri (Mars)**
Threshold: anger, reaction
Lesson: clarity
Password: *"IEŌU ZAZAZAŌ THŌTHŌTH."*

---

**Gate 4 — Yabel (Sun)**
Threshold: vanity, ego
Lesson: transparency
Password: *"I come from the Pre-existent One."*

---

**Gate 5 — Adonaios (Venus)**
Threshold: craving, desire
Lesson: wholeness
Password: *"ZAMA ZAMA ŌZZA RACHAMA ŌZAI."*

---

**Gate 6 — Sabaoth (Mercury)**
Threshold: overthinking
Lesson: stillness
Password: *"I am a vessel of the Light."*

---

**Gate 7 — Belias / Yaldabaoth (Moon)**
Threshold: instability, illusion
Lesson: sovereignty
Password:
> *"IEŌU IEŌU IEŌU*
> *AŌ AŌ AŌ*
> *ŌTHŌTH ABRASAX."*`,
      },
      {
        id: "init-5",
        title: "Gatework Rituals",
        content: `## Gatework Rituals

Each gate ritual follows the same four-part structure:

1. **Purification** — use the Rite of Breath or Water from Chapter 2
2. **Invocation** — call Sophia using the Threefold or Full invocation
3. **Confrontation** — sit with the archon's quality (e.g., despair, pride, anger) without fleeing it
4. **Declaration** — speak the password aloud or inwardly

---

### How to Work a Gate

**Before you begin:**
- Choose one gate to work with
- Do not rush through all seven in one session
- Work one gate per week minimum

**During the ritual:**
1. Perform the Rite of Stillness (5 minutes)
2. Perform the Threefold Sophia Invocation
3. Bring the archon's quality into awareness — feel it fully
4. Speak the password three times
5. Visualise the gate opening as a shaft of light
6. Step through inwardly

**After the ritual:**
- Rest for 5–10 minutes
- Write any impressions in a journal
- Notice how the archon's quality shifts over the following days

---

### Signs of Progress

You are passing a gate when:
- The emotional quality loses its grip on you
- You can observe the state without being consumed by it
- Clarity arises where confusion once lived
- You feel lighter, more sovereign, more present

> This is the inner curriculum of the Gnostic path. You are not learning about liberation — you are practising it.`,
      },
    ],
  },
];

export const getCourseById = (id: string) => COURSES.find(c => c.id === id);
export const getLessonById = (courseId: string, lessonId: string) => {
  const course = getCourseById(courseId);
  return course?.lessons.find(l => l.id === lessonId);
};
