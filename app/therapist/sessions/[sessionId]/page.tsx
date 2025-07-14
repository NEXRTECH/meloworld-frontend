"use client";
import { useTherapistStore } from "@/components/stores/therapist-store";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { useParams, useRouter } from "next/navigation";
import React, { use } from "react";
import { BsChevronLeft, BsPerson, BsPersonFill, BsStop } from "react-icons/bs";
import { FiHash, FiUser, FiUserCheck, FiInfo, FiClock } from "react-icons/fi";
import { GoCheck } from "react-icons/go";
import { PiPerson } from "react-icons/pi";
import { AiOutlineStop } from "react-icons/ai";
import { useToast } from "@/components/hooks/use-toast";
import { stat } from "fs";
import { useEffect } from "react";
import { Session } from "@/components/types";
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
import TextArea from "@/components/ui/textarea/textarea";
import dynamic from "next/dynamic";

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

const SessionPage = () => {
  const router = useRouter();
  const { sessionId } = useParams();
  const { startSession, cancelSession, getSession, updateSession, endSession } =
    useTherapistStore((state) => state);
  const sessions = useTherapistStore((state) => state.sessions);
  const session = sessions.find(
    (session) => session.session_id === sessionId
  );
  const { toast } = useToast();
  const [feedback, setFeedback] = React.useState("");
  if (!session) {
    return <div>Session not found</div>;
  }

  useEffect(() => {
    const fetchSession = async () => {
      if (
        session.session_status === "Cancelled" ||
        session.session_status == "Scheduled" ||
        session.session_status == "Completed"
      )
        return;
      try {
        await getSession(session.session_id);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    const interval = setInterval(fetchSession, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const handleCancelSession = () => {
    cancelSession(session.session_id)
      .then(() => {
        toast({
          title: "Session cancelled successfully",
          description: "The session has been cancelled.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error cancelling session",
          description: error.message,
          variant: "error",
        });
      });
  };

  const handleStartSession = () => {
    startSession(session.session_id)
      .then(() => {
        toast({
          title: "Session started successfully",
          description: "The session has been started.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error starting session",
          description: error.message,
          variant: "error",
        });
      });
  };

  const handleEndSession = () => {
    endSession(session.session_id, feedback)
      .then(() => {
        toast({
          title: "Session started successfully",
          description: "The session has been started.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error starting session",
          description: error.message,
          variant: "error",
        });
      });
  };

  const handleApproveUser = (patientName: string) => {
    // Handle user approval logic here
    if (session.metadata) {
      const update: Partial<Session> = {
        metadata: {
          ...session.metadata,
          waiting: session.metadata.waiting.filter(
            (patient) => patient !== patientName
          ),
          participants: [...(session.metadata.participants || []), patientName],
        },
      };
      updateSession(session.session_id, update)
        .then(() => {
          toast({
            title: "User approved successfully",
            description: `${patientName} has been approved.`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Error approving user",
            description: error.message,
            variant: "error",
          });
        });
    }
  };

  const handleDenyUser = (patientName: string) => {
    // Handle user approval logic here
    if (session.metadata) {
      const update: Partial<Session> = {
        metadata: {
          ...session.metadata,
          waiting: session.metadata.waiting.filter(
            (patient) => patient !== patientName
          ),
        },
      };
      updateSession(session.session_id, update)
        .then(() => {
          toast({
            title: "User denied successfully",
            description: `${patientName} has been denied entry.`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Error denying user",
            description: error.message,
            variant: "error",
          });
        });
    }
  };

  return (
    <div className="dashboard-panel">
      <Button
        onClick={() => router.push("/therapist/sessions")}
        variant="outline"
        size="xs"
      >
        <BsChevronLeft />
        Back
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Session Details</h1>
        <div>
          <Card className="bg-white/60 w-full flex flex-wrap mt-2 text-xs shadow rounded-b p-6 gap-5">
            <div className="flex items-center">
              <FiInfo size={20} className=" mr-2" />
              <span className="font-semibold  mr-1">Status:</span>
              <span className="">{session.session_status}</span>
            </div>
            <div className="flex items-center">
              <FiClock size={20} className=" mr-2" />
              <span className="font-semibold  mr-1">Start Time:</span>
              <span className="">
                {formatISODate(session.start_time)}
              </span>
            </div>
            <div className="flex items-center">
              <FiClock size={20} className=" mr-2" />
              <span className="font-semibold  mr-1">End Time:</span>
              <span className="">
                {formatISODate(session.end_time)}
              </span>
            </div>
            <div className="flex items-center">
              <FiClock size={20} className=" mr-2" />
              <span className="font-semibold  mr-1">Updated At:</span>
              <span className="">
                {formatISODate(session.updated_at)}
              </span>
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-2 mt-5">
          <Button
            disabled={
              session.session_status === "Cancelled" ||
              session.session_status === "In Progress" ||
              session.session_status === "Completed"
            }
            onClick={handleStartSession}
            size="xs"
            variant="outline"
          >
            Start Session
          </Button>
          {session.session_status === "Scheduled" && (
            <Button onClick={handleCancelSession} size="xs" variant="outline">
              Cancel
            </Button>
          )}
          {session.session_status === "In Progress" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="xs" variant="outline">
                  End Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new session</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col gap-2 w-full h-full">
                      <label
                        htmlFor="feedback"
                        className="text-base font-semibold"
                      >
                        Session Feedback
                      </label>
                      <TextArea
                        value={feedback}
                        onChange={(e) => {
                          setFeedback(e.target.value);
                        }}
                        id="feedback"
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="w-full flex gap-2">
                    <Button onClick={handleEndSession} size="xs">
                      End
                    </Button>
                    <Button size="xs" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {(session.session_status === "In Progress" ||
          session.session_status === "Completed") && (
          <div>
            <h2 className="mt-5">Waiting Queue</h2>
            {session.metadata &&
            session.metadata.waiting &&
            session.metadata.waiting.length > 0 ? (
              <div className="w-full mt-2 flex flex-col gap-5 justify-between items-center">
                {session.metadata.waiting.map((patient, id) => (
                  <Card
                    key={id}
                    className="p-3 bg-white w-full border  flex flex-row justify-between items-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BsPersonFill />
                      <p>{patient}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveUser(patient)}
                        size="xs"
                        variant="outline"
                      >
                        <GoCheck /> Approve
                      </Button>
                      <Button
                        onClick={() => handleDenyUser(patient)}
                        size="xs"
                        variant="outline"
                      >
                        <AiOutlineStop /> Deny
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No patients in the waiting queue.</p>
            )}

            <h2 className="mt-5">Participants</h2>
            <div className="flex flex-col gap-2">
              {session.metadata &&
              session.metadata.participants &&
              session.metadata.participants.length > 0 ? (
                <div className="w-full mt-2 flex flex-col gap-5 justify-between items-center">
                  {session.metadata.participants.map((patient, id) => (
                    <Card key={id} className="px-3 py-5 border bg-white w-full">
                      <div className="w-full flex lg:flex-row flex-col gap-2 justify-between items-center">
                        <div className="flex items-center justify-center gap-2">
                          <BsPersonFill />
                          <p>{patient}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No participants in the session.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
