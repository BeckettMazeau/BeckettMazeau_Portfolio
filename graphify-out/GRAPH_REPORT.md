# Graph Report - .  (2026-06-01)

## Corpus Check
- Large corpus: 60 files · ~1,659,800 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 97 nodes · 77 edges · 27 communities (14 shown, 13 thin omitted)
- Extraction: 53% EXTRACTED · 47% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_STIK-eNote Hardware|STIK-eNote Hardware]]
- [[_COMMUNITY_Pomodoro Timer|Pomodoro Timer]]
- [[_COMMUNITY_Physics Simulation|Physics Simulation]]
- [[_COMMUNITY_STIK Firmware|STIK Firmware]]
- [[_COMMUNITY_Rocket Oven Design|Rocket Oven Design]]
- [[_COMMUNITY_3D Rendering Core|3D Rendering Core]]
- [[_COMMUNITY_Ray Tracer|Ray Tracer]]
- [[_COMMUNITY_STIK Schematics|STIK Schematics]]
- [[_COMMUNITY_Portfolio Overview|Portfolio Overview]]
- [[_COMMUNITY_N-Body Physics|N-Body Physics]]
- [[_COMMUNITY_Task Manager|Task Manager]]
- [[_COMMUNITY_Shading Models|Shading Models]]
- [[_COMMUNITY_Image Processing|Image Processing]]
- [[_COMMUNITY_STIK Electronics|STIK Electronics]]
- [[_COMMUNITY_Convolution Ops|Convolution Ops]]
- [[_COMMUNITY_Graphics Math|Graphics Math]]
- [[_COMMUNITY_Thermal Analysis|Thermal Analysis]]
- [[_COMMUNITY_LCD Display Driver|LCD Display Driver]]
- [[_COMMUNITY_Project Summary|Project Summary]]
- [[_COMMUNITY_UI Layout|UI Layout]]
- [[_COMMUNITY_Button Controls|Button Controls]]
- [[_COMMUNITY_Memory Management|Memory Management]]
- [[_COMMUNITY_PCB Layout|PCB Layout]]
- [[_COMMUNITY_Casing Design|Casing Design]]
- [[_COMMUNITY_File IO|File I/O]]
- [[_COMMUNITY_Sensor Integration|Sensor Integration]]
- [[_COMMUNITY_Application Logic|Application Logic]]

## God Nodes (most connected - your core abstractions)
1. `StikE eNote IoT Device` - 8 edges
2. `STIK-eNote Embedded Device` - 6 edges
3. `Composite Rocket Body Curing Oven` - 5 edges
4. `loadSection()` - 4 edges
5. `Physics Simulation Domain` - 4 edges
6. `KiCad PCB Design` - 3 edges
7. `3D Rendering Engine` - 3 edges
8. `Physical Simulation` - 3 edges
9. `Embedded User Interface` - 3 edges
10. `permissions` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Curing Oven Interior Chamber` --references--> `Composite Rocket Body Curing Oven`  [EXTRACTED]
  images/InternalWideShot.JPG → projects/project-1.html
- `STIK-eNote Electrical Block Diagram` --references--> `STIK-eNote Embedded Device`  [EXTRACTED]
  images/ElectricalDiagram.png → projects/project-6.html
- `Portfolio Site Launch` --references--> `Composite Rocket Body Curing Oven`  [INFERRED]
  updates/update-1.html → projects/project-1.html
- `KiCad PCB Back Layer` --references--> `KiCad PCB Design`  [EXTRACTED]
  images/BackPCB.png → projects/project-6.html
- `KiCad PCB Front Layer` --references--> `KiCad PCB Design`  [EXTRACTED]
  images/FrontPCB.png → projects/project-6.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Portfolio Projects Collection** — project1_rocket_oven, project2_image_processing, project3_ray_tracer, project4_nbody_simulation, project5_lightspeed, project6_stik_enote [EXTRACTED 1.00]
- **STIK-eNote Hardware Subsystems** — project6_esp32_firmware, project6_display_management, project6_kicad_pcb [EXTRACTED 1.00]
- **Software Architecture and Design Patterns** — project1_design_process, project2_color_abstraction, project3_multithreading, project6_display_management [INFERRED 0.75]
- **StikE eNote Hardware Design System** — images_stike_pcb, images_stike_schematic_1, images_stike_schematic_2, images_stike_schematic_3, images_stike_schematic_4, images_stike_schematic_5, concept_stike_device [EXTRACTED 1.00]
- **Pomodoro Focus Timer Hardware Implementation** — images_pomodoroscreen, images_pomodorosetup, concept_pomodoro_timer [INFERRED 0.90]
- **3D Graphics Rendering Application Suite** — images_scenecreatorgui, images_settingsgui, concept_3d_rendering [INFERRED 0.85]
- **Solar Energy Collection Analysis** — images_solar_nbody, images_solar_energy_tilt, images_solar_watts_tilt, images_solar_ray_visibility [INFERRED 0.95]
- **3D Graphics Rendering Portfolio** — images_testscene1, images_testscene2, images_testscene3 [INFERRED 0.90]
- **Image Processing Pipeline** — images_beautifulcowedge, images_beautifulcowblurred [INFERRED 0.90]

## Communities (27 total, 13 thin omitted)

### Community 0 - "STIK-eNote Hardware"
Cohesion: 0.18
Nodes (11): STIK-eNote Electrical Block Diagram, KiCad PCB Back Layer, KiCad PCB Front Layer, Beckett Mazeau Portfolio, Mechatronics Engineer, STIK-eNote Device, Dual Display Management System, FreeRTOS Dual-Core Firmware (+3 more)

### Community 1 - "Pomodoro Timer"
Cohesion: 0.25
Nodes (6): comingSoonHTML(), fetchMeta(), formatDate(), initRevealObserver(), loadSection(), updateCardHTML()

### Community 2 - "Physics Simulation"
Cohesion: 0.25
Nodes (9): Data Visualization, Physics Simulation Domain, Physical Simulation, Lightspeed Visualization - High Velocity, Lightspeed Visualization - Zero Velocity, Solar Energy Collection vs Orbital Tilt Graph, N-Body Simulation Visualization, Solar Ray Visibility Diagram (+1 more)

### Community 3 - "STIK Firmware"
Cohesion: 0.22
Nodes (9): StikE eNote IoT Device, Embedded Device System Settings Interface, Sleep Schedule Task Display, StikE PCB Circuit Board Layout, StikE eNote Main Circuit Schematic, StikE Power and Charging Circuit Schematic, StikE Microcontroller and WiFi Module Schematic, StikE Logic Level Converter Schematic (+1 more)

### Community 4 - "Rocket Oven Design"
Cohesion: 0.33
Nodes (6): Curing Oven Interior Chamber, Arduino-Based Thermal Control System, Structured Design Process, Rice Eclipse Rocketry Team, Composite Rocket Body Curing Oven, Portfolio Site Launch

### Community 5 - "3D Rendering Core"
Cohesion: 0.40
Nodes (5): Multi-threaded Rendering, Phong Reflection Model, Java Ray Tracer, Solar Energy N-Body Simulation, Orbital Mechanics and Ray Tracing

### Community 6 - "Ray Tracer"
Cohesion: 0.50
Nodes (4): 3D Rendering Engine, 3D Rendered Test Scene 1 - Spheres, 3D Rendered Test Scene 2 - Colorful Spheres, Eye of Sauron - Geometric Pattern

### Community 7 - "STIK Schematics"
Cohesion: 0.50
Nodes (4): Embedded User Interface, Stik Note Rendering - Handheld Device UI, Task Management Screen, User Interface - Keypad and LCD Display

### Community 8 - "Portfolio Overview"
Cohesion: 0.50
Nodes (3): allProjects, selectedProjects, updates

### Community 11 - "Shading Models"
Cohesion: 1.00
Nodes (3): 3D Graphics Rendering Engine, 3D Scene Creator Interface, 3D Graphics Settings Configuration Panel

### Community 12 - "Image Processing"
Cohesion: 0.67
Nodes (3): Image Processing, Image Processing - Blur Applied to Cow, Image Processing - Edge Detection on Cow

### Community 13 - "STIK Electronics"
Cohesion: 1.00
Nodes (3): Pomodoro Timer Technique, Pomodoro Timer Hardware Display, Pomodoro Focus Timer Display Setup

### Community 14 - "Convolution Ops"
Cohesion: 0.67
Nodes (3): Custom Color Class Abstraction, Java Image Processing Application, Java Swing GUI

### Community 15 - "Graphics Math"
Cohesion: 0.67
Nodes (3): Relativistic Doppler Shift, Demonstrator of Phenomena at Lightspeed, Lorentz-FitzGerald Length Contraction

## Knowledge Gaps
- **53 isolated node(s):** `version`, `configurations`, `allow`, `selectedProjects`, `allProjects` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 8 inferred relationships involving `StikE eNote IoT Device` (e.g. with `Embedded Device System Settings Interface` and `Sleep Schedule Task Display`) actually correct?**
  _`StikE eNote IoT Device` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Composite Rocket Body Curing Oven` (e.g. with `Structured Design Process` and `Portfolio Site Launch`) actually correct?**
  _`Composite Rocket Body Curing Oven` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `Physics Simulation Domain` (e.g. with `Solar Energy Collection vs Orbital Tilt Graph` and `N-Body Simulation Visualization`) actually correct?**
  _`Physics Simulation Domain` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `version`, `configurations`, `allow` to the rest of the system?**
  _56 weakly-connected nodes found - possible documentation gaps or missing edges._