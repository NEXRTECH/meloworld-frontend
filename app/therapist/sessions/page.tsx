"use client";

import { useToast } from "@/components/hooks/use-toast";
import { useAuthStore } from "@/components/stores/auth-store";
import { useTherapistStore } from "@/components/stores/therapist-store";
import { Session } from "@/components/types";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import Input from "@/components/ui/input/input";
import Select from "@/components/ui/select/select";
import Table from "@/components/ui/table/table";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  BsChevronRight,
  BsFilter,
  BsHeadsetVr,
  BsInfo,
  BsInfoCircle,
  BsPlus,
  BsArrowRepeat,
} from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";


const patientData = [
  {
    patient_id: 1,
    user_id: 1,
    symptoms: ["headache", "fatigue", "dizziness"],
    progress: {
      notes: "Symptoms are not worsening.",
      status: "stable",
      last_update: "2025-03-25",
    },
    history: {
      allergies: ["penicillin"],
      past_conditions: ["asthma"],
      hospitalized_before: false,
    },
    created_at: "2025-05-05T19:04:00.674Z",
    updated_at: "2025-05-05T19:04:00.674Z",
    metadata: null,
    first_name: "Test",
    last_name: "User",
    email: "test1@melo.com",
  },
  {
    patient_id: 2,
    user_id: 2,
    symptoms: ["nausea", "shortness of breath"],
    progress: {
      notes: "Under observation.",
      status: "improving",
      last_update: "2025-04-20",
    },
    history: {
      allergies: [],
      past_conditions: ["diabetes"],
      hospitalized_before: true,
    },
    created_at: "2025-05-06T10:00:00.000Z",
    updated_at: "2025-05-06T10:00:00.000Z",
    metadata: null,
    first_name: "Alice",
    last_name: "Smith",
    email: "test2@melo.com",
  },
  {
    patient_id: 3,
    user_id: 3,
    symptoms: ["back pain", "insomnia"],
    progress: {
      notes: "Further tests required.",
      status: "critical",
      last_update: "2025-04-15",
    },
    history: {
      allergies: ["gluten"],
      past_conditions: ["migraine"],
      hospitalized_before: false,
    },
    created_at: "2025-05-07T14:30:00.000Z",
    updated_at: "2025-05-07T14:30:00.000Z",
    metadata: null,
    first_name: "Bob",
    last_name: "Johnson",
    email: "test3@melo.com",
  },
];

const getPatientDetails = (patientId: number) => {
  return patientData.filter((p) => p.patient_id == patientId)[0];
};

const formatISODate = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${month} ${day}, ${year}, ${displayHours}:${displayMinutes} ${ampm}`;
};

const SessionsPage: React.FC = () => {
  const router = useRouter();
  const { fetchSessionsByTherapistId, createSession, updateSession } =
    useTherapistStore((s) => s);
  const sessions = useTherapistStore((s) => s.sessions);
  const { metadata } = useAuthStore((s) => s);
  if (!metadata) {
    return <div>Loading...</div>;
  }
  const { name, therapist_id } = metadata;
  const [newSessionDate, setNewSessionDate] = useState<string>("");
  const [filter, setFilter] = useState<string>("Scheduled");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!therapist_id) return;
    setIsLoading(true);
    fetchSessionsByTherapistId(therapist_id, filter as "Completed" | "Scheduled" | "In Progress" | "Cancelled")
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch sessions.",
          variant: "error",
        });
      });
  }, [therapist_id, filter]);

  useEffect(() => {
    console.log("Sessions updated:", sessions);
  }, [sessions, therapist_id]);

  const handleCreateSession = () => {
    if (!newSessionDate) {
      toast({
        title: "Error",
        description: "Please select a date and time for the session.",
        variant: "error",
      });
      return;
    }

    createSession(therapist_id, newSessionDate, {}, 1)
      .then(() => {
        toast({
          title: "Success",
          description: "Session created successfully.",
          variant: "success",
        });
        setNewSessionDate("");
      })
      .catch((error) => {
        console.error("Error creating session:", error);
        toast({
          title: "Error",
          description: "Failed to create session.",
          variant: "error",
        });
      });
  };

  return (
    <div className="dashboard-panel relative">
      <div className="w-full flex justify-between">
        <h1>Your Sessions</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FaPlus />
              <p className="hidden lg:block">Create New</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new session</DialogTitle>
              <DialogDescription>
                <div className="flex flex-col gap-2 w-full h-full">
                  <label htmlFor="date" className="text-base font-semibold">
                    Date
                  </label>
                  <Input
                    value={newSessionDate}
                    onChange={(e) => {
                      setNewSessionDate(e.target.value);
                    }}
                    id="date"
                    type="datetime-local"
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="w-full flex gap-2">
                <Button onClick={handleCreateSession} size="xs">
                  Create
                </Button>
                <Button size="xs" variant="outline">
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-5 bg-white">
        <div className="flex items-center gap-2 mb-5">
          <BsFilter />
          <Select
            items={[
              { label: "Completed", value: "Completed" },
              { label: "In Progress", value: "In Progress" },
              { label: "Scheduled", value: "Scheduled" },
              { label: "Cancelled", value: "Cancelled" },
            ]}
            placeholder="Filter by status"
            value={filter}
            onValueChange={(value) => {
              setFilter(value);
            }}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <CgSpinner className="animate-spin text-sky-900" size={32} />
          </div>
        ) : (
          <Table headings={["Session ID", "Start Time", "End Time", "More"]}>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No {filter.toLowerCase()} sessions found
                </td>
              </tr>
            ) : (
              sessions.map((session) => {
                return (
                  <tr
                    key={session.session_id}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="text-sm">{session.session_id}</td>
                    <td className="text-sm">
                      {formatISODate(session.start_time)}
                    </td>
                    <td className="text-sm">
                      {formatISODate(session.end_time)}
                    </td>
                    <td className="text-sm">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          router.push(
                            `/therapist/sessions/${session.session_id}`
                          );
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default SessionsPage;
