import { useEffect, useMemo, useState } from "react";
import StepIndicator from "@/components/steps/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/components/CategoryFilters";
import { DateTimePicker } from "@/components/DateTimePicker";
import MapPicker from "@/components/MapPicker/MapPicker";
import { PostCard, Post } from "@/components/PostCard";

const steps = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Preview" },
];

type FormState = {
  category: Exclude<Category, "All"> | null;
  title: string;
  description: string;
  location: string;
  coords: { lng: number; lat: number } | null;
  // Events
  dateTime: Date | null;
  rsvpLimit?: number;
  // Issues
  urgency?: number;
  // Jobs
  company?: string;
  pay?: string;
  // Good Deeds
  image?: File | null;
  // Donations
  itemName?: string;
  condition?: string;
  pickup?: string;
  contact?: string;
};

const initialState: FormState = {
  category: null,
  title: "",
  description: "",
  location: "",
  coords: null,
  dateTime: null,
  rsvpLimit: undefined,
  urgency: 3,
  company: "",
  pay: "",
  image: null,
  itemName: "",
  condition: "Good",
  pickup: "",
  contact: "",
};

const PostCreate = () => {
  const [current, setCurrent] = useState(1);
  const [state, setState] = useState<FormState>(initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Create Post – Local Hero";
  }, []);

  useEffect(() => {
    if (state.image) {
      const url = URL.createObjectURL(state.image);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [state.image]);

  const canNext = useMemo(() => {
    if (current === 1) return !!state.category;
    if (current === 2) {
      const base = state.title && state.description;
      switch (state.category) {
        case "Events":
          return base && state.location && state.dateTime && state.coords && typeof state.rsvpLimit === "number";
        case "Issues":
          return base && state.location && typeof state.urgency === "number";
        case "Jobs":
          return base && state.company && state.location && state.pay;
        case "Good Deeds":
          return base && state.location;
        case "Donations":
          return base && state.itemName && state.condition && state.pickup && state.contact;
        default:
          return false;
      }
    }
    return true;
  }, [current, state]);

  function onPublish() {
    const post: Post = {
      id: String(Date.now()),
      type: (state.category as Post["type"]) || "Events",
      title: state.title,
      description: state.description,
      location: state.location || state.pickup || "",
      time: state.dateTime ? state.dateTime.toLocaleString() : "",
      createdAt: new Date().toISOString(),
      coordinates: state.coords ? [state.coords.lng, state.coords.lat] : undefined,
    };
    console.log("Submitting post", { state, post });
    toast({ title: "Post published", description: "Your community post is live!" });
  }

  function reset() {
    setState(initialState);
    setCurrent(1);
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold mb-2">Create a Community Post</h1>
      <p className="text-muted-foreground mb-6">Share events, report issues, post jobs, and more.</p>

      <StepIndicator steps={steps} current={current} />

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Step {current}: {steps[current - 1].label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {current === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {["Events","Issues","Jobs","Good Deeds","Donations"].map((c) => (
                <button
                  key={c}
                  onClick={() => setState((s) => ({ ...s, category: c as FormState["category"] }))}
                  className={`rounded-md border px-3 py-2 text-sm ${state.category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
                  aria-pressed={state.category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {current === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={state.title} onChange={(e) => setState({ ...state, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" value={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} rows={6} />
                </div>

                {state.category === "Jobs" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={state.company} onChange={(e) => setState({ ...state, company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pay">Pay</Label>
                      <Input id="pay" placeholder="$20/hr" value={state.pay} onChange={(e) => setState({ ...state, pay: e.target.value })} />
                    </div>
                  </>
                )}

                {state.category === "Donations" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="item">Item Name</Label>
                      <Input id="item" value={state.itemName} onChange={(e) => setState({ ...state, itemName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select value={state.condition} onValueChange={(v) => setState({ ...state, condition: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Info</Label>
                      <Input id="contact" placeholder="email or phone" value={state.contact} onChange={(e) => setState({ ...state, contact: e.target.value })} />
                    </div>
                  </>
                )}

                {state.category === "Good Deeds" && (
                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setState({ ...state, image: e.target.files?.[0] })} />
                    {imagePreview && (
                      <img src={imagePreview} alt="Upload preview" className="h-40 w-full object-cover rounded-md border" />
                    )}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {state.category && ["Events","Issues","Jobs","Good Deeds"].includes(state.category) && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={state.location} onChange={(e) => setState({ ...state, location: e.target.value })} placeholder="Enter location name" />
                    <MapPicker value={state.coords} onChange={(coords) => setState({ ...state, coords: coords })} />
                  </div>
                )}

                {state.category === "Events" && (
                  <>
                    <div className="space-y-2">
                      <Label>Date & Time</Label>
                      <DateTimePicker value={state.dateTime} onChange={(d) => setState({ ...state, dateTime: d })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rsvp">RSVP Limit</Label>
                      <Input id="rsvp" type="number" min={1} value={state.rsvpLimit ?? ""} onChange={(e) => setState({ ...state, rsvpLimit: Number(e.target.value) })} />
                    </div>
                  </>
                )}

                {state.category === "Issues" && (
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Slider value={[state.urgency || 3]} min={1} max={5} step={1} onValueChange={(v) => setState({ ...state, urgency: v[0] })} />
                    <p className="text-sm text-muted-foreground">{state.urgency}/5</p>
                  </div>
                )}

                {state.category === "Donations" && (
                  <div className="space-y-2">
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Input id="pickup" value={state.pickup} onChange={(e) => setState({ ...state, pickup: e.target.value })} />
                  </div>
                )}
              </div>
            </div>
          )}

          {current === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PostCard post={{
                  id: "preview",
                  type: (state.category as Post["type"]) || "Events",
                  title: state.title || "Untitled",
                  description: state.description || "No description",
                  location: state.location || state.pickup || "",
                  time: state.dateTime ? state.dateTime.toLocaleString() : "",
                  createdAt: new Date().toISOString(),
                  coordinates: state.coords ? [state.coords.lng, state.coords.lat] : undefined,
                }} />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Good deed" className="w-full rounded-md border" />
                  </div>
                )}
              </div>
              <div className="lg:col-span-1 space-y-2 text-sm text-muted-foreground">
                <p><strong>Category:</strong> {state.category}</p>
                {state.company && <p><strong>Company:</strong> {state.company}</p>}
                {state.pay && <p><strong>Pay:</strong> {state.pay}</p>}
                {state.itemName && <p><strong>Item:</strong> {state.itemName} ({state.condition})</p>}
                {state.contact && <p><strong>Contact:</strong> {state.contact}</p>}
                {typeof state.rsvpLimit === "number" && <p><strong>RSVP Limit:</strong> {state.rsvpLimit}</p>}
                {typeof state.urgency === "number" && <p><strong>Urgency:</strong> {state.urgency}/5</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="secondary" onClick={() => setCurrent((c) => Math.max(1, c - 1))} disabled={current === 1}>Back</Button>
            {current < 3 ? (
              <Button onClick={() => setCurrent((c) => Math.min(3, c + 1))} disabled={!canNext}>Next</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={reset}>Reset</Button>
                <Button onClick={onPublish}>Publish</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCreate;
