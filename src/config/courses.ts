/**
 * EXSi Technologies — Central Course Catalog Configuration
 *
 * EDIT HERE to update any course details:
 * - Titles, descriptions, fees, duration, batch timings
 * - Level, prerequisites, syllabus modules and topics
 *
 * Changes made here automatically update:
 * 1. Homepage course cards (/ and /#courses)
 * 2. Courses catalog page (/courses)
 * 3. Individual course detail pages (/courses/[slug])
 * 4. Course registration section (/courses/[slug]#register-section)
 */

export interface CourseModule {
  module: string;
  topics: string[];
}

export interface Course {
  slug: string;
  title: string;
  icon: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  mode: string;
  fee: string;
  batchStart: string;
  level: string;
  enquiryOnly: boolean;
  prerequisites: string;
  highlights: string[];
  syllabus: CourseModule[];
}

export const courses: Course[] = [
  {
    slug: "verilog-hdl-rtl-design",
    icon: "⌁",
    image: "/images/grid-eda.jpg",
    title: "Verilog HDL, RTL Design & Digital Projects",
    shortDesc:
      "Build end-to-end digital design skills with synthesizable Verilog, RTL verification, and practical hardware projects.",
    fullDesc:
      "This comprehensive programme takes students from digital logic fundamentals through synthesizable RTL design, verification, and applied hardware projects. Build combinational and sequential modules, Mealy and Moore state machines, and self-checking testbenches, then apply those skills to UART controllers, clock-domain-crossing FIFOs, and a pipelined 32-bit ALU. The programme also covers simulation, synthesis checks, FPGA constraints, debugging, and project documentation.",
    duration: "4 weeks",
    mode: "Live online",
    fee: "₹1,000",
    batchStart: "Jan 1",
    level: "",
    enquiryOnly: false,
    prerequisites: "Basic digital electronics (logic gates, flip-flops, number systems).",
    highlights: [
      "Synthesizable Verilog and combinational/sequential RTL",
      "Mealy and Moore finite state machine design",
      "Self-checking testbenches, simulation, and debugging",
      "UART controller and communication peripheral projects",
      "Clock-domain-crossing FIFO design",
      "32-bit pipelined ALU implementation",
      "Synthesis checks, FPGA constraints, and project documentation",
    ],
    syllabus: [
      {
        module: "Module 1: Digital Hardware & Synthesizable Verilog Syntax",
        topics: [
          "Hardware Description Language vs. Software code semantics",
          "Synthesizable data types: wire, reg, vectors, parameters",
          "Continuous assignment & combinational logic modeling (assign)",
          "Dataflow vs. Gate-level structural modeling",
        ],
      },
      {
        module: "Module 2: Procedural Logic & Avoiding Inferred Latches",
        topics: [
          "always @(*) vs. always @(posedge clk)",
          "Blocking (=) vs. Non-blocking (<=) race conditions and hardware semantics",
          "Registers, counters, shift registers, and clock dividers",
          "Writing synthesizable Verilog — avoiding inferred latches",
        ],
      },
      {
        module: "Module 3: Finite State Machine (FSM) Architecture",
        topics: [
          "Mealy vs. Moore state machine architectures and timing slacks",
          "Industry standard 2-process vs. 3-process FSM coding style",
          "Overlapping and non-overlapping sequence detector implementations",
          "Real-world case study: Traffic light controller & UART TX state machine",
        ],
      },
      {
        module: "Module 4: Verification, Self-Checking Testbenches & Simulation",
        topics: [
          "DUT instantiation, stimulus generation, and clock generation logic",
          "Tasks, functions, $display, $monitor, and automated assertions",
          "Generating VCD dump files and debugging race conditions in GTKWave",
          "Corner-case stress testing and regression simulation",
        ],
      },
      {
        module: "Module 5: Capstone RTL Module Synthesis Signoff",
        topics: [
          "Full implementation of a digital timer core / UART controller",
          "Top-level hierarchy integration, port mapping, and parameterization",
          "Logic synthesis check using lint reports",
          "Code review, mentor feedback, and GitHub project packaging",
        ],
      },
      {
        module: "Project 1: Configurable Baud-Rate UART Controller Core",
        topics: [
          "Baud rate clock generator from high-frequency system oscillator",
          "Transmitter FSM and Receiver 16x oversampling state machine",
          "Loopback testing, parity validation, and framing error flags",
        ],
      },
      {
        module: "Project 2: Synchronous & Asynchronous Dual-Clock FIFO",
        topics: [
          "Circular buffer storage with pointer arithmetic",
          "Clock Domain Crossing (CDC) and 2-flop Gray code synchronizers",
          "Full, almost-full, empty, and almost-empty generation logic",
        ],
      },
      {
        module: "Project 3: 32-Bit Pipelined Arithmetic Logic Unit (ALU)",
        topics: [
          "High-speed Carry Lookahead Adder (CLA) datapath",
          "Logical, arithmetic, shift, and comparison instruction decoding",
          "Pipeline register stage insertions and latency balancing",
        ],
      },
      {
        module: "Project 4: Synthesis & Portfolio Packaging",
        topics: [
          "FPGA architectural building blocks (LUTs, BRAMs, DSP slices)",
          "Pin assignments and hardware timing constraints (.xdc)",
          "Writing clear README architecture documentation for recruiter review",
        ],
      },
    ],
  },
];

/**
 * Helper to get a single course by its slug
 */
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
