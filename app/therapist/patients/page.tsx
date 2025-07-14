"use client";
import { useAuthStore } from "@/components/stores/auth-store";
import { Patient, Therapist } from "@/components/types";
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
import { getAssignedPatientsByTherapistId } from "@/services/therapist";
import React, { useEffect, useState } from "react";
import { IoCalendar } from "react-icons/io5";
import { MdOutlineEventNote, MdOutlineSick } from "react-icons/md";
import { TbInfoCircle, TbMoodSick } from "react-icons/tb";

const PatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { metadata } = useAuthStore((s) => s);
  useEffect(() => {
    if (metadata && "therapist_id" in metadata) {
      const fetchPatients = async (therapistId: string) => {
        try {
          const response = await getAssignedPatientsByTherapistId(therapistId);
          if (response && response.ok) {
            const data = response.data;
            setPatients(data["patients"]);
          }
        } catch (err) {
          console.error(err);
          throw err;
        }
      };
      fetchPatients(metadata["therapist_id"]);
    }
  }, [metadata]);

  useEffect(() => {
    // TODO: get patient data from API
  }, []);
  return (
    <div className="dashboard-panel">
      <h1>Your patients</h1>
      <div className="flex flex-wrap gap-8 mt-5 w-full">
        {patients.length > 0 ? (
          <>
            {patients.map((p) => (
              <div className="w-72 hover:-translate-y-1 hover:scale-110 transition duration-300">
                <Card className="relative p-5 mt-2  flex flex-col gap-5 bg-white/60">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="absolute right-6 top-6 hover:cursor-pointer hover:text-primary">
                        <TbInfoCircle className="text-xl" />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {`${p.first_name + " " + p.last_name}`}
                          <hr />
                        </DialogTitle>
                        <DialogDescription>
                          <div className="w-full h-full">
                            <div className="my-5">
                              <h3 className="flex items-center gap-1">
                                <MdOutlineEventNote /> History
                              </h3>
                              <div className="ml-5 mt-1">
                                <h4 className="flex font-semibold text-sm items-center gap-1">
                                  <TbMoodSick /> Allergies
                                </h4>
                                <p>
                                  {p.history.allergies.length > 0
                                    ? p.history.allergies.join(", ")
                                    : "None"}
                                </p>

                                <h4 className="flex font-semibold text-sm items-center gap-1">
                                  <IoCalendar /> Past conditions
                                </h4>
                                <p>
                                  {p.history.past_conditions.length > 0
                                    ? p.history.past_conditions.join(", ")
                                    : "None"}
                                </p>
                              </div>
                            </div>
                            <div className="mb-5">
                              <h3 className="flex items-center gap-1">
                                <MdOutlineSick /> Symptoms
                              </h3>
                              <p>
                                {p.symptoms.length > 0
                                  ? p.symptoms.join(", ")
                                  : "None"}
                              </p>
                            </div>
                            <hr />
                            <div className="mt-5">
                              <div className="mt-2">
                                <h3>Progress</h3>
                                <div className="flex flex-col gap-3">
                                  <div>
                                    <p className="font-semibold">Status</p>
                                    <p>{p.progress.status}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Notes</p>
                                    <p className="text-xs">
                                      {p.progress.notes}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      Last updated
                                    </p>
                                    <p className="text-xs">
                                      {p.progress.last_update}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter></DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <h3>{`${p.first_name + " " + p.last_name}`}</h3>
                  <hr />
                  <div>
                    <h3 className="flex items-center gap-1">
                      <MdOutlineEventNote /> History
                    </h3>
                    <div className="ml-5 mt-1">
                      <h4 className="flex font-semibold text-sm items-center gap-1">
                        <TbMoodSick /> Allergies
                      </h4>
                      <p>
                        {p.history.allergies.length > 0
                          ? p.history.allergies.join(", ")
                          : "None"}
                      </p>

                      <h4 className="flex font-semibold text-sm items-center gap-1">
                        <IoCalendar /> Past conditions
                      </h4>
                      <p>
                        {p.history.past_conditions.length > 0
                          ? p.history.past_conditions.join(", ")
                          : "None"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1">
                      <MdOutlineSick /> Symptoms
                    </h3>
                    <p>
                      {p.symptoms.length > 0 ? p.symptoms.join(", ") : "None"}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </>
        ) : (
          <p>No Assigned Patients yet!</p>
        )}
      </div>
    </div>
  );
};

export default PatientPage;
