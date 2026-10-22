---
title: "My Journey into Linux Kernel Development"
subtitle: "What I learned from the LFX Mentorship Program"
date: "2025-11-30"
dateLabel: "NOV 2025"
readingTime: "5 MIN"
excerpt: "A beginner's step-by-step journey into fixing real Linux kernel bugs, learning from syzbot, and contributing upstream."
tags: ["linux kernel", "open source", "mentorship"]
---

When I joined the LFX Linux Kernel Bugfixing Mentorship, I knew I was entering something different from anything I had done before. I had worked on systems, machine learning, and low-level code before, but the Linux kernel was on another level; millions of lines of C, decades of history, and a workflow based entirely on mailing lists. I started the program with curiosity, uncertainty, and a simple goal: understand how real kernel development works and make meaningful contributions.

This blog is a simple account of what I learned, the bugs I worked on, and how I slowly became comfortable debugging and contributing to the Linux kernel.

## Starting Out: Getting Used to the Kernel Environment

My first few days were all about learning how the kernel is organized, how patches are written, and how maintainers expect things to be communicated. The biggest shift for me was adapting to the mailing-list workflow:

- Patches must be sent using `git send-email`
- Threads must be correctly maintained using message IDs
- Commit messages must be written in a clear, consistent style
- Every patch must have a purpose, with no cosmetic fixes

I started with simple changes, like fixing documentation warnings and correcting a variable name in a driver. These early patches helped me learn the process without touching anything too risky.

Slowly, I moved toward areas where I had to understand the code more deeply.

## Learning Through Real Bugs: My First Encounters With syzbot

A major part of this mentorship involved working with syzbot, an automated fuzzer that constantly tests the Linux kernel. When it finds a bug, it reports:

- A crash trace
- A reproducer
- Details about the failing subsystem

At first, these reports looked complicated, but with practice I learned how to read them and trace the error back to the exact problem.

## The I2C Use-After-Free Bug: Understanding Lifetime Rules

One of my first real bugs was in the I2C core. The issue was a race condition between removing an adapter and another thread trying to get the same adapter. Understanding this required learning:

- How IDR (ID registry) works
- How device lifetimes are managed
- When reference counts must be incremented or decremented

Fixing this bug taught me how important ordering is in kernel teardown paths.

## The DTV5100 Buffer Overflow: Why Sizes Matter

Another interesting bug came from a USB media driver (DTV5100). It used an 80-byte buffer but copied data into it without checking the input length. syzbot passed 4096 bytes, which caused an overflow.

This was a simple fix, but it taught me how small oversights in drivers can lead to serious memory issues. It also showed me how important sanitizers like KASAN are in catching problems like this.

## The DVB Use-After-Free: Learning from VFS Semantics

The DVB bug was about mismatched reference counting between the `.open()` and `.release()` handlers. I learned that even if `.open()` fails, the VFS still calls `.release()`, so the subsystem must not free the object early.

This bug forced me to understand:

- How VFS handles open/close
- How subsystems rely on VFS guarantees
- Why a single extra `put()` can crash everything

These kinds of bugs helped me realize that kernel development is mostly about understanding rules and making sure every function follows them correctly.

## Selftests, Documentation, and the Parts Behind the Scenes

Not all my patches were deep into driver logic. Some involved:

### Seccomp selftests

I improved error messages, fixed indentation issues, and reorganized variable placement. This helped me understand:

- How kselftest works
- Why good test output matters
- How maintainers expect test code to be structured

### RTLA documentation

I fixed undefined substitutions that caused Sphinx build errors. Here I learned:

- How kernel documentation is built
- How Sphinx interacts with kernel-doc comments
- Why clean documentation builds are important for maintainers

These changes may not be as dramatic as memory bugs, but they are necessary for keeping the kernel ecosystem healthy and maintainable.

## What I Learned From the Mentors and Community

My mentors guided me through each step, from understanding the crash logs to writing proper commit messages. From them, I learned:

- How to think systematically while debugging
- Why small details in patches matter
- How to communicate clearly in a mailing-list environment

The Linux kernel community itself also taught me a lot. Reviewers expect patches to be calm, logical, and well-explained. Feedback is direct but always focused on improving the code. Once I understood this, I became much more confident participating in discussions.

## Growing Slowly, One Patch at a Time

Looking back, the most important part of this journey was patience. Debugging kernel crashes is not something you learn overnight. Many times I had to:

- Rebuild the kernel repeatedly
- Re-run test programs
- Read through unfamiliar subsystems
- Backtrack through stack traces
- Test ideas that did not work

But each bug taught me something new. By the time I submitted fixes across I2C, DVB, USB media drivers, documentation, init, and seccomp selftests, I felt far more comfortable navigating the kernel.

I realised that the kernel may be large, but it follows consistent principles. Once you learn these principles (lifetime rules, locking, reference counting, error paths), debugging becomes easier.

## Where I Stand Now

The mentorship helped me build a strong foundation in:

- Kernel debugging
- Memory safety
- Understanding subsystem interactions
- Working with syzbot
- Using tools like `sparse`, `coccicheck`, and sanitizers
- Writing and submitting upstream patches

More importantly, it made the Linux kernel feel like a space I can continue contributing to.

This journey was not just about fixing bugs. It was about learning how to think like a kernel developer.

## Closing Thoughts

The LFX Linux Kernel Bugfix Mentorship gave me a clear path into a field that is usually difficult to enter. It taught me how to break down complex issues, communicate clearly with maintainers, and understand the kernel one subsystem at a time.

I am grateful to my mentors, the maintainers who reviewed my patches, and the fellow mentees who shared their struggles and solutions. I look forward to continuing my contributions and deepening my understanding of kernel internals.

---

*Originally published on [Medium](https://medium.com/@inft.sameeksha/my-journey-into-linux-kernel-development-what-i-learned-from-the-lfx-mentorship-program-bc4571c9cca9).*
