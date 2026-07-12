import * as React from "react"
import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import { Menu, X, Check, Mail, Phone, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Animated Group Component
interface AnimatedGroupProps {
  children: React.ReactNode
  className?: string
  variants?: {
    container?: any
    item?: any
  }
}

function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  const defaultContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const defaultItemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Testimonial Card Component
interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

function TestimonialCard({ author, text, href, className }: TestimonialCardProps) {
  const classes = cn(
    "flex flex-col rounded-lg border-t",
    "bg-gradient-to-b from-muted/50 to-muted/10",
    "p-4 text-start sm:p-6",
    "hover:from-muted/60 hover:to-muted/20",
    "max-w-[320px] sm:max-w-[320px]",
    "transition-colors duration-300",
    className
  )

  const content = (
    <>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none">{author.name}</h3>
          <p className="text-sm text-muted-foreground">{author.handle}</p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-muted-foreground">{text}</p>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return <div className={classes}>{content}</div>
}

// Testimonials Section
interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-0",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((testimonial, i) => (
                  <TestimonialCard key={`${setIndex}-${i}`} {...testimonial} />
                ))
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}

// Logo Component
const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 78 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-auto", className)}
    >
      <path
        d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148Z"
        fill="currentColor"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="10"
          y1="0"
          x2="10"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Header Component
const menuItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "group fixed z-20 w-full border-b transition-colors duration-150",
          scrolled && "bg-background/50 backdrop-blur-3xl"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <a href="#contact">
                    <span>Get Started</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

// Hero Section
const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

function HeroSection() {
  return (
    <main className="overflow-hidden">
      <section>
        <div className="relative pt-24">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
          <div className="mx-auto max-w-5xl px-6">
            <div className="sm:mx-auto lg:mr-auto">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
              >
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16">
                  Generate Quality Leads for Your Software Business
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground">
                  Transform your lead generation strategy with our powerful software solution. Capture, nurture, and convert more leads than ever before.
                </p>
                <div className="mt-12 flex items-center gap-2">
                  <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                    <Button asChild size="lg" className="rounded-xl px-5 text-base">
                      <a href="#contact">
                        <span className="text-nowrap">Start Free Trial</span>
                      </a>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-[42px] rounded-xl px-5 text-base"
                  >
                    <a href="#pricing">
                      <span className="text-nowrap">View Pricing</span>
                    </a>
                  </Button>
                </div>
              </AnimatedGroup>
            </div>
          </div>
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div
                aria-hidden
                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-background">
                <img
                  className="bg-background aspect-[15/8] relative rounded-2xl"
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=640&fit=crop"
                  alt="Lead generation dashboard"
                  width="2700"
                  height="1440"
                />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </main>
  )
}

// Features Section
function Features() {
  return (
    <section id="features" className="dark:bg-muted/25 bg-zinc-50 py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold sm:text-4xl mb-4">
            Powerful Features for Lead Generation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to capture, manage, and convert leads effectively
          </p>
        </div>
        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          <Card className="group overflow-hidden shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium">Advanced Lead Tracking</p>
                <p className="text-muted-foreground mt-3 max-w-sm text-sm">
                  Track every interaction with your leads in real-time. Get detailed insights into lead behavior and engagement.
                </p>
              </div>
            </CardHeader>

            <div className="relative h-fit pl-6 md:pl-12">
              <div className="absolute -inset-6 [background:radial-gradient(75%_95%_at_50%_0%,transparent,hsl(var(--background))_100%)]"></div>

              <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=900&fit=crop"
                  className="rounded-tl-lg"
                  alt="Lead tracking dashboard"
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6">
              Automated Lead Nurturing
            </p>

            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                <div className="aspect-[76/59] overflow-hidden rounded-r-lg border">
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop"
                    className="rounded-r-lg"
                    alt="Automation illustration"
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group p-6 shadow-black/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            <p className="mx-auto mb-12 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl">
              Smart Lead Scoring
            </p>

            <div className="flex justify-center gap-6">
              <div className="bg-muted/35 relative flex aspect-square size-16 items-center rounded-lg border p-3 shadow-lg">
                <span className="absolute right-2 top-1 block text-sm">AI</span>
                <Check className="mt-auto size-4" />
              </div>
              <div className="bg-muted/35 flex aspect-square size-16 items-center justify-center rounded-lg border p-3 shadow-lg">
                <span className="text-2xl font-bold">A+</span>
              </div>
            </div>
          </Card>

          <Card className="group relative shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium">Seamless Integrations</p>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                Connect with your favorite tools and platforms effortlessly.
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="rounded-lg aspect-square border border-dashed"></div>
                <div className="bg-muted/50 flex aspect-square items-center justify-center rounded-lg border p-4">
                  <img
                    className="m-auto size-8 dark:invert"
                    src="https://cdn.simpleicons.org/salesforce"
                    alt="Salesforce"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="rounded-lg aspect-square border border-dashed"></div>
                <div className="bg-muted/50 flex aspect-square items-center justify-center rounded-lg border p-4">
                  <img
                    className="m-auto size-8 dark:invert"
                    src="https://cdn.simpleicons.org/hubspot"
                    alt="HubSpot"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="rounded-lg aspect-square border border-dashed"></div>
                <div className="bg-muted/50 flex aspect-square items-center justify-center rounded-lg border p-4">
                  <img
                    className="m-auto size-8 dark:invert"
                    src="https://cdn.simpleicons.org/slack"
                    alt="Slack"
                    width="32"
                    height="32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses just getting started",
      price: 29,
      yearlyPrice: 290,
      features: [
        "Up to 1,000 leads/month",
        "Basic lead tracking",
        "Email support",
        "2 team members",
        "Basic analytics",
      ],
    },
    {
      name: "Professional",
      description: "Best for growing businesses with advanced needs",
      price: 79,
      yearlyPrice: 790,
      popular: true,
      features: [
        "Up to 10,000 leads/month",
        "Advanced lead tracking",
        "Priority support",
        "10 team members",
        "Advanced analytics",
        "Custom integrations",
        "Lead scoring",
      ],
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom requirements",
      price: 199,
      yearlyPrice: 1990,
      features: [
        "Unlimited leads",
        "Enterprise tracking",
        "24/7 dedicated support",
        "Unlimited team members",
        "Custom analytics",
        "All integrations",
        "AI-powered insights",
        "Custom workflows",
      ],
    },
  ]

  return (
    <section id="pricing" className="py-16 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business needs
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={!isYearly ? "default" : "outline"}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </Button>
            <Button
              variant={isYearly ? "default" : "outline"}
              onClick={() => setIsYearly(true)}
            >
              Yearly (Save 20%)
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative",
                plan.popular && "border-primary shadow-lg scale-105"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${isYearly ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="size-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: "How does the lead generation software work?",
      answer:
        "Our software captures leads from multiple sources, tracks their behavior, scores them based on engagement, and helps you nurture them through automated workflows until they're ready to convert.",
    },
    {
      question: "Can I integrate with my existing CRM?",
      answer:
        "Yes! We offer seamless integrations with popular CRMs like Salesforce, HubSpot, and many others. You can sync your leads automatically and maintain a single source of truth.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide email support for all plans, priority support for Professional plans, and 24/7 dedicated support for Enterprise customers. We also have extensive documentation and video tutorials.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We take security seriously. All data is encrypted in transit and at rest, we're GDPR compliant, and we undergo regular security audits. Your data is backed up daily.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely! You can cancel your subscription at any time with no penalties. You'll continue to have access until the end of your billing period.",
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our lead generation software
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <h3 className="text-lg font-semibold">{faq.question}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-32 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-8">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="size-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">contact@leadgen.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="size-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="size-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Office</h3>
                  <p className="text-muted-foreground">
                    123 Business St, Suite 100<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Company</label>
                  <Input placeholder="Your company" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea placeholder="Tell us about your needs..." rows={4} />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Proof/Stats Section
function ProofSection() {
  const stats = [
    { value: "10M+", label: "Leads Generated" },
    { value: "50K+", label: "Active Users" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "3x", label: "Average ROI Increase" },
  ]

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold sm:text-4xl mb-4">
            Trusted by Thousands of Businesses
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Join the companies that have transformed their lead generation
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-muted/30 py-12 border-t">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm text-muted-foreground">
              The leading lead generation software for modern businesses.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 LeadGen Software. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function LeadGenerationPage() {
  const testimonials = [
    {
      author: {
        name: "Sarah Johnson",
        handle: "@sarahj",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      },
      text: "This software has completely transformed our lead generation process. We've seen a 300% increase in qualified leads in just 3 months!",
    },
    {
      author: {
        name: "Michael Chen",
        handle: "@mchen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "The automation features save us hours every week. Our sales team can now focus on closing deals instead of manual data entry.",
    },
    {
      author: {
        name: "Emily Rodriguez",
        handle: "@emilyrod",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      text: "Best investment we've made for our business. The ROI is incredible and the support team is always there when we need them.",
    },
    {
      author: {
        name: "David Kim",
        handle: "@davidk",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      text: "The lead scoring feature is a game-changer. We can now prioritize our efforts on the most promising leads.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <HeroSection />
      <ProofSection />
      <Features />
      <PricingSection />
      <TestimonialsSection
        title="Loved by Businesses Worldwide"
        description="See what our customers have to say about transforming their lead generation"
        testimonials={testimonials}
      />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
