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
} from "react-icons/bs";
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

  const { toast } = useToast();

  useEffect(() => {
    if (!therapist_id) return;
    fetchSessionsByTherapistId(therapist_id);
  }, [therapist_id]);

  useEffect(() => {
    console.log("Sessions updated:", sessions);
  }, [sessions]);

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
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <h1>My WebGL in Next.js</h1>
      </div>
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
        <Table headings={["Session ID", "Start Time", "End Time", "More"]}>
          {sessions
            .filter((s) => s.session_status == filter)
            .map((session) => {
              return (
                <tr
                  key={session.session_id}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="text-sm">{session.session_id}</td>
                  <td className="text-sm">
                    {new Date(session.start_time).toLocaleString()}
                  </td>
                  <td className="text-sm">
                    {new Date(session.end_time).toLocaleString()}
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
            })}
        </Table>
      </Card>
    </div>
  );
};

export default SessionsPage;
