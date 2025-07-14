"use client";

import { useAuthStore } from "@/components/stores/auth-store";
import { Patient, Therapist } from "@/components/types";
import Card from "@/components/ui/card/card";
import Table from "@/components/ui/table/table";
import { getPatientById, getTherapistById } from "@/services/therapist";
import React, { useEffect, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { IoPeople } from "react-icons/io5";

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

const sessionData = [
  {
    session_id: 1,
    patient_id: "1",
    therapist_id: 1,
    content_id: null,
    session_status: "Completed",
    start_time: "2025-03-26T10:00:00.000Z",
    end_time: "2025-02-01T11:30:00.000Z",
    created_at: "2025-05-05T19:55:58.015Z",
    updated_at: "2025-05-05T19:56:25.494Z",
    metadata: {
      completion_feedback: "Patient responded well to therapy.",
    },
    patient_user_id: 1,
    therapist_user_id: null,
  },
  {
    session_id: 2,
    patient_id: "1",
    therapist_id: 1,
    content_id: 101,
    session_status: "Upcoming",
    start_time: "2025-04-26T10:00:00.000Z",
    end_time: "2025-04-26T11:30:00.000Z",
    created_at: "2025-02-01T10:00:00.000Z",
    updated_at: "2025-02-01T10:00:00.000Z",
    metadata: {
      completion_feedback: "N/A",
    },
    patient_user_id: 2,
    therapist_user_id: 1,
  },
  {
    session_id: 3,
    patient_id: "1",
    therapist_id: 1,
    content_id: 102,
    session_status: "Completed",
    start_time: "2025-01-26T10:00:00.000Z",
    end_time: "2025-01-26T11:30:00.000Z",
    created_at: "2024-12-05T19:55:58.015Z",
    updated_at: "2024-12-05T19:56:25.494Z",
    metadata: {
      completion_feedback: "Patient reported improvement.",
    },
    patient_user_id: 3,
    therapist_user_id: 1,
  },
];

const TherapistHome = () => {
  const [patients, setPatients] = useState<Record<number, Patient>>({});
  const { metadata } = useAuthStore(s => s)
  if (!metadata) {
    return <div>Loading...</div>;
  }
  const { name, therapist_id } = metadata;

  useEffect(() => {
    const fetchPatient = async (patientId: string) => {
      try {
        const response = await getPatientById(patientId as string);
        if (response && response.ok) {
          const data = response.data;
          return data["patient"];
        }
      } catch (err) {
        console.error(err);
        return {
          patient_id: patientId,
        };
      }
    };

    // const fetchTherapist = async (therapistId: number) => {
    //   try {
    //     const response = await getTherapistById(therapistId);
    //     if (response && response.ok) {
    //       const data = response.data;
          
    //       return data;
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     return {
    //       therapist_id: therapistId,
    //     };
    //   }
    // };

    // fetchTherapist(therapist_id);

    (async () => {
      const updatedSessions = await Promise.all(
        sessionData.map(async (session) => {
          const patientData = await fetchPatient(session.patient_id);
          setPatients((prev) => ({
            ...prev,
            [session.patient_id]: patientData,
          }));
        })
      );
      // console.log(updatedSessions);
    })();
  }, [name]);

  const stats = [
    {
      title: "Sessions Completed",
      stat: 1,
      icon: <BsCheck2Circle />,
    },
    {
      title: "Total Patients",
      stat: 3,
      icon: <IoPeople />,
    },
  ];

  return (
    <div className="dashboard-panel">
      <div className="flex flex-col gap-5">
        <h1>Welcome back {name}!</h1>
        <div
          className="
      w-full
      flex
      flex-wrap
      justify-center
      lg:justify-around
      items-start
        gap-5
        lg:gap-0
    "
        >
          {/* Stats */}
          {stats.map((stat, id) => (
            <div
              className="px-3 lg:px-5 py-2 card lg:w-52 min-w-32 hover:-translate-y-1 transition duration-200 gap-1 flex flex-col justify-start items-center"
              key={id}
            >
              <div className="text-primary/70 rounded-lg text-4xl p-1">
                {stat.icon}
              </div>
              <p className="text-xl lg:text-xl font-bold">
                {stat.stat.toLocaleString()}
              </p>
              <p className="text-xs">{stat.title}</p>
            </div>
          ))}
        </div>
        <div>
          <h2>Your upcoming sessions</h2>
          <Card className="p-5 mt-2 bg-white/60">
            <Table headings={["Patient", "Start Time", "End Time"]}>
              {sessionData
                .filter((s) => s.session_status === "Upcoming")
                .map((s) => (
                  <tr key={`sess-${s.session_id}`}>
                    <td>
                      {patients[s.patient_id]
                        ? patients[s.patient_id].first_name
                        : ""}
                    </td>

                    <td>{formatISODate(s.start_time)}</td>
                    <td>{formatISODate(s.end_time)}</td>
                  </tr>
                ))}
            </Table>
          </Card>
        </div>

        <div>
          <h2>Your completed sessions</h2>
          <Card className="p-5 mt-2 bg-white/60">
            <Table headings={["Patient", "Start Time", "End Time", "Feedback"]}>
              {sessionData
                .filter((s) => s.session_status === "Completed")
                .map((s) => (
                  <tr key={`sess-${s.session_id}`}>
                    <td>
                      {patients[s.patient_id]
                        ? patients[s.patient_id].first_name
                        : ""}
                    </td>
                    <td>{formatISODate(s.start_time)}</td>
                    <td>{formatISODate(s.end_time)}</td>
                    <td>{s.metadata.completion_feedback}</td>
                  </tr>
                ))}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistHome;
