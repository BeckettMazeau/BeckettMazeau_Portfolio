/* ============================================================
   Beckett Mazeau — content manifest (data-driven grids)
   Edit this file to add/reorder projects + updates. The `home`
   array controls which projects appear on the home page & order.
   Image paths are relative to site root; site.js prefixes depth.
   NOTE: body copy below is PLACEHOLDER pending final writeups.
   ============================================================ */
window.SITE = {
  profile: {
    name: "Beckett Mazeau",
    tagline: "Making Mechatronics",
    blurb: "Mechanical · aerospace · embedded. I take hardware from schematic to soldered, tested, and shipped.",
    location: "Houston, TX",
    status: "Available for engineering roles",
    email: "beckett@example.com",
    links: [ { label: "GitHub", href: "#" }, { label: "LinkedIn", href: "#" }, { label: "Résumé", href: "#" } ],
    focus: [
      { k: "Mechanical design", v: "CAD · FEA" },
      { k: "Embedded systems", v: "C · RTOS" },
      { k: "PCB + power", v: "KiCad" },
      { k: "Aerospace analysis", v: "MATLAB" }
    ]
  },

  /* home selected-work manifest — order matters */
  home: ["stik-enote", "orbital-solar", "embedded-control", "directional-trough"],

  projects: [
    {
      slug: "stik-enote",
      title: "STIK eNote",
      role: "Firmware + Industrial Design",
      year: "2026",
      summary: "A pocket e-paper task companion — custom PCB, power tree, lid-switch wake, and a calendar/task UI written from the display driver up.",
      thumb: "uploads/stik-enote-render.png",
      contain: true,
      meta: [ { k: "Role", v: "Firmware + ID" }, { k: "Year", v: "2026" }, { k: "Stack", v: "C++ · KiCad" }, { k: "Course", v: "EDES 301" } ],
      sections: [
        { h: "Overview", body: ["[Placeholder] The STIK eNote is a clamshell, pocket-sized productivity device built around an e-paper display and a physical QWERTY keyboard. It surfaces your tasks and calendar at a glance and runs for weeks on a single charge.", "Final writeup text is supplied separately — this paragraph stands in to show body rhythm and measure."] },
        { h: "What I built", body: ["[Placeholder] Designed the enclosure, laid out a custom power board, and wrote the UI firmware against the display controller. A magnetic lid switch wakes the device the instant it opens."] },
        { h: "Result", body: ["[Placeholder] A working daily-driver prototype: instant-on, glanceable, and quiet. Two-line summary on the rear screen keeps the next task visible even when closed."] }
      ],
      gallery: [
        { src: "uploads/stik-enote-render.png", caption: "Industrial design render — open clamshell", contain: true, span: "wide" },
        { src: "uploads/CalendarMonthView.JPG", caption: "Calendar month view on the TFT bring-up rig", span: "tall" },
        { src: "uploads/ElectronicCompartment.JPG", caption: "Control electronics during integration", span: "half" },
        { src: "uploads/StikE_Schematic_page-0002.jpg", caption: "Power circuitry — schematic sheet 2/5", contain: true, span: "wide" }
      ]
    },
    {
      slug: "orbital-solar",
      title: "Orbital Solar Collection Study",
      role: "Systems Analysis",
      year: "2025",
      summary: "Modeling total solar energy collected by satellites across a sweep of orbital tilt angles relative to the ecliptic plane.",
      thumb: "uploads/solar_energy_vs_tilt_graph.png",
      contain: true,
      meta: [ { k: "Role", v: "Analysis" }, { k: "Year", v: "2025" }, { k: "Tools", v: "MATLAB" }, { k: "Domain", v: "Aerospace" } ],
      sections: [
        { h: "Question", body: ["[Placeholder] How does a satellite's orbital tilt relative to the ecliptic plane change the total solar energy it can collect over a two-year mission?"] },
        { h: "Method", body: ["[Placeholder] Swept orbital inclination and integrated incident flux across the mission window, then fit the collected-energy curve to characterize the high-collection regime."] },
        { h: "Finding", body: ["[Placeholder] Collected energy climbs sharply toward near-polar tilt before falling off — the fitted cubic captures the rising edge of the curve."] }
      ],
      gallery: [
        { src: "uploads/solar_energy_vs_tilt_graph.png", caption: "Total joules collected vs. orbital tilt, with fitted curve", contain: true, span: "wide" }
      ]
    },
    {
      slug: "embedded-control",
      title: "Embedded Control Stack",
      role: "Electronics + Controls",
      year: "2024",
      summary: "A motor-driver and sensing stack wired and tuned on an Arduino core inside a custom enclosure.",
      thumb: "uploads/ElectronicCompartment.JPG",
      contain: false,
      meta: [ { k: "Role", v: "Electronics" }, { k: "Year", v: "2024" }, { k: "Core", v: "Arduino" }, { k: "Build", v: "Protoboard" } ],
      sections: [
        { h: "Overview", body: ["[Placeholder] The control stack drives a synchronous AC motor and reads a cluster of sensors, all routed through a hand-soldered protoboard shield over an Arduino core."] },
        { h: "Integration", body: ["[Placeholder] Labeled harnessing and a flat layout kept the bring-up debuggable — every signal line is traceable from the board to its actuator or sensor."] }
      ],
      gallery: [
        { src: "uploads/ElectronicCompartment.JPG", caption: "Control electronics and motor inside the enclosure", span: "wide" }
      ]
    },
    {
      slug: "directional-trough",
      title: "Directional Solidification Trough",
      role: "Mechanical + Thermal",
      year: "2025",
      summary: "A 2.4-meter insulated trough built for controlled, directional cooling — foil-lined, heater-laced, and instrumented.",
      thumb: "uploads/InternalWideShot.JPG",
      contain: false,
      meta: [ { k: "Role", v: "Mechanical" }, { k: "Year", v: "2025" }, { k: "Length", v: "2.4 m" }, { k: "Focus", v: "Thermal" } ],
      sections: [
        { h: "Overview", body: ["[Placeholder] The trough creates a controlled thermal gradient along its length so material solidifies directionally from one end to the other."] },
        { h: "Construction", body: ["[Placeholder] A plywood shell lined with reflective foil insulation and laced with resistive heating elements, instrumented for closed-loop temperature control."] }
      ],
      gallery: [
        { src: "uploads/InternalWideShot.JPG", caption: "Foil-lined trough interior during assembly", span: "tall" }
      ]
    },
    {
      slug: "stik-power",
      title: "STIK Power Architecture",
      role: "PCB + Power Electronics",
      year: "2026",
      summary: "The charge, boost, and regulation chain behind the STIK eNote — LiPo charging, 5V buck-boost, 3.3V LDO, and a lid-switch wake.",
      thumb: "uploads/StikE_Schematic_page-0002.jpg",
      contain: true,
      meta: [ { k: "Role", v: "PCB" }, { k: "Year", v: "2026" }, { k: "Tool", v: "KiCad 10" }, { k: "Rev", v: "V3" } ],
      sections: [
        { h: "Overview", body: ["[Placeholder] The power board takes a single LiPo cell and produces clean 5V and 3.3V rails while charging safely and waking the system on lid open."] },
        { h: "Topology", body: ["[Placeholder] A TPB4056 charger feeds a TPS61322 buck-boost for the 5V rail; an XC6206 LDO drops to 3.3V; a Hall-effect lid switch gates wake."] }
      ],
      gallery: [
        { src: "uploads/StikE_Schematic_page-0002.jpg", caption: "Power circuitry — KiCad schematic, sheet 2/5", contain: true, span: "wide" }
      ]
    },
    {
      slug: "calendar-ui",
      title: "Calendar UI Firmware",
      role: "Embedded UI",
      year: "2026",
      summary: "A month-grid calendar rendered straight to a TFT from embedded firmware — drawn cell-by-cell from the display driver up.",
      thumb: "uploads/CalendarMonthView.JPG",
      contain: false,
      meta: [ { k: "Role", v: "Firmware" }, { k: "Year", v: "2026" }, { k: "Display", v: "TFT" }, { k: "Lang", v: "C++" } ],
      sections: [
        { h: "Overview", body: ["[Placeholder] The calendar UI lays out a full month grid on a small TFT, computing day-of-week offsets and rendering each cell directly over SPI."] },
        { h: "Notes", body: ["[Placeholder] Built on the breadboard bring-up rig before migrating to the STIK eNote hardware."] }
      ],
      gallery: [
        { src: "uploads/CalendarMonthView.JPG", caption: "Month grid rendered on the TFT bring-up rig", span: "tall" }
      ]
    }
  ],

  updates: [
    {
      slug: "stik-power-board",
      title: "Bring-up of the STIK power board",
      date: "May 18, 2026",
      dateISO: "2026-05-18",
      lede: "First power-on of the rev-V3 board — charge, boost, and regulation rails all came up clean.",
      content: [
        "[Placeholder] Short update copy goes here. This page is intentionally lighter-weight than a full case study — a dated note with a couple of paragraphs and an image or two.",
        "[Placeholder] Replace with the real write-up. The layout flexes from a text-only post to one with inline figures."
      ],
      figures: [
        { src: "uploads/StikE_Schematic_page-0002.jpg", caption: "The rev-V3 power schematic under test", contain: true },
        { src: "uploads/ElectronicCompartment.JPG", caption: "Bench bring-up wiring" }
      ]
    },
    {
      slug: "trough-thermal-test",
      title: "Trough thermal test #3 — results",
      date: "Apr 02, 2026",
      dateISO: "2026-04-02",
      lede: "Third thermal run on the directional trough — gradient held steady end to end.",
      content: [
        "[Placeholder] Short update copy goes here. Swap in the real notes from the test session.",
        "[Placeholder] A second paragraph to show measure and rhythm on a lighter post."
      ],
      figures: [
        { src: "uploads/InternalWideShot.JPG", caption: "Trough interior before the run" }
      ]
    }
  ]
};
