"use client";

import * as React from "react";
import {
  ArrowRight,
  Lightbulb,
  LogOut,
  Search,
  Settings,
  Shirt,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  CalloutCard,
  Card,
  CardDescription,
  CardTitle,
  Chip,
  CountBadge,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  IconButton,
  Input,
  Modal,
  PromoBadge,
  ScoreBadge,
  ScoreCircle,
  SectionHeader,
  Select,
  Skeleton,
  SkeletonGrid,
  SkeletonText,
  StatCard,
  StateView,
  Tag,
  Textarea,
  useToast,
} from "@/components/ui";

function Row({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5xl">
      <SectionHeader eyebrow="Component" title={title} as="h3" />
      <div className="flex flex-wrap items-start gap-lg">{children}</div>
    </section>
  );
}

export function Gallery() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [chips, setChips] = React.useState<string[]>(["minimalist"]);
  const [flavour, setFlavour] = React.useState<string>();

  function toggleChip(value: string) {
    setChips((current) =>
      current.includes(value)
        ? current.filter((c) => c !== value)
        : [...current, value],
    );
  }

  return (
    <main className="mx-auto max-w-[1000px] px-lg py-5xl sm:px-3xl">
      <header className="mb-6xl">
        <p className="text-eyebrow uppercase text-text-muted">
          CheckoutFitt design system
        </p>
        <h1 className="mt-sm text-display text-text-primary">
          Component gallery
        </h1>
        <p className="mt-md max-w-[60ch] text-body-lg text-text-secondary">
          Every shared primitive, rendered from the same tokens the app uses.
        </p>
      </header>

      <Row title="Button">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger" iconLeft={<Trash2 className="size-4" />}>
          Delete
        </Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
        <Button size="lg" iconRight={<ArrowRight className="size-4" />}>
          Large
        </Button>
        <IconButton label="Search">
          <Search className="size-[18px]" />
        </IconButton>
      </Row>

      <Row title="Card">
        <Card className="w-[280px]">
          <CardTitle>Standard</CardTitle>
          <CardDescription>Border, radius-xl, shadow-md.</CardDescription>
        </Card>
        <Card variant="hero" className="w-[280px]">
          <CardTitle>Hero</CardTitle>
          <CardDescription>Deeper shadow, roomier padding.</CardDescription>
        </Card>
        <Card variant="flat" className="w-[280px]">
          <CardTitle>Flat</CardTitle>
          <CardDescription>Secondary surface, no shadow.</CardDescription>
        </Card>
        <Card interactive className="w-[280px]">
          <CardTitle>Interactive</CardTitle>
          <CardDescription>Hover to lift.</CardDescription>
        </Card>
      </Row>

      <Row title="Input">
        <div className="w-[300px]">
          <Input label="Email" placeholder="you@example.com" icon={<Search />} />
        </div>
        <div className="w-[300px]">
          <Input label="Password" passwordToggle placeholder="••••••••" />
        </div>
        <div className="w-[300px]">
          <Input label="Name" defaultValue="Sar" error="Name is too short." />
        </div>
        <div className="w-[300px]">
          <Select
            label="Occasion"
            placeholder="Pick one…"
            value={flavour}
            onChange={setFlavour}
            options={[
              { value: "casual", label: "Casual" },
              { value: "office", label: "Office" },
              { value: "date_night", label: "Date night" },
            ]}
          />
        </div>
        <div className="w-[300px]">
          <Textarea label="Notes" rows={3} placeholder="Anything to remember…" />
        </div>
      </Row>

      <Row title="Chip and tag">
        {["minimalist", "streetwear", "old money", "casual"].map((c) => (
          <Chip key={c} selected={chips.includes(c)} onClick={() => toggleChip(c)}>
            {c}
          </Chip>
        ))}
        <Tag>cotton</Tag>
        <Tag>navy</Tag>
      </Row>

      <Row title="Avatar, badge, score">
        <Avatar name="Sarah Chen" size="sm" />
        <Avatar name="Sarah Chen" size="md" />
        <Avatar name="Sarah Chen" size="lg" />
        <Badge tone="primary">Primary</Badge>
        <Badge tone="success">Worth it</Badge>
        <Badge tone="warning">Maybe</Badge>
        <Badge tone="danger">Skip</Badge>
        <CountBadge count={3} />
        <PromoBadge>Most popular</PromoBadge>
        <ScoreBadge score={8.5} />
        <ScoreCircle score={8.5} label="Overall" />
      </Row>

      <Row title="Stat and callout">
        <StatCard value="42" label="Total items" icon={<Shirt />} className="w-[220px]" />
        <StatCard value="$4,280" label="Closet value" className="w-[220px]" />
        <CalloutCard icon={<Lightbulb />} title="Why this outfit" className="max-w-[460px]">
          The oxford keeps it sharp while the chinos stop it reading as formal —
          right for a relaxed office day.
        </CalloutCard>
      </Row>

      <Row title="Overlays">
        <Button variant="outline" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              kind: "success",
              title: "Outfit saved",
              description: "Find it under Saved outfits.",
            })
          }
        >
          Show toast
        </Button>
        <Dropdown
          label="Account menu"
          trigger={<Avatar name="Sarah Chen" size="sm" />}
        >
          <DropdownItem icon={<User />}>Profile</DropdownItem>
          <DropdownItem icon={<Settings />}>Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={<LogOut />} danger>
            Log out
          </DropdownItem>
        </Dropdown>
      </Row>

      <Row title="Divider">
        <div className="w-full max-w-[460px]">
          <Divider label="or continue with" />
        </div>
      </Row>

      <section className="mb-5xl">
        <SectionHeader eyebrow="Component" title="Skeleton" as="h3" />
        <div className="flex flex-col gap-xl">
          <SkeletonText lines={3} className="max-w-[460px]" />
          <Skeleton className="h-11 w-[200px] rounded-lg" />
          <SkeletonGrid count={4} />
        </div>
      </section>

      <section className="mb-5xl">
        <SectionHeader eyebrow="Component" title="State view" as="h3" />
        <Card>
          <StateView
            icon={<Sparkles />}
            title="No outfits yet"
            description="Generate your first outfit and it'll show up here."
            action={<Button iconLeft={<Sparkles className="size-4" />}>Generate outfit</Button>}
          />
        </Card>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete this item?"
        description="This removes the piece from your closet. Outfits using it will keep their other pieces."
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              Delete item
            </Button>
          </>
        }
      />
    </main>
  );
}
