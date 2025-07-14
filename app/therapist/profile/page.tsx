"use client";
import { useAuthStore } from "@/components/stores/auth-store";
import { Therapist } from "@/components/types";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import { getTherapistById } from "@/services/therapist";
import React, { useEffect, useState } from "react";
import { FaPerson } from "react-icons/fa6";
import { FiEdit, FiSave, FiSettings } from "react-icons/fi";

const therapist: Therapist = {
  therapist_id: "2",
  user_id: null,
  email: "test@melo.com",
  password: "test@1234",
  therapist_name: "Dr. Smith",
  dob: "1980-01-01T00:00:00.000Z",
  license_number: "LIC-001",
  specializations: '{"anxiety","stress"}',
  assigned_user_ids: [],
  metadata: null,
  created_at: "2025-05-16T07:59:13.550Z",
  updated_at: "2025-05-16T07:59:13.550Z",
};

const TherapistProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [therapistData, setTherapistData] = useState<Therapist | null>(null);
  const { metadata } = useAuthStore((s) => s);

  useEffect(() => {
    if (metadata && "therapist_id" in metadata) {
      const fetchTherapist = async (therapistId: string) => {
        console.log("fetching therapist with id:", therapistId);
        try {
          const response = await getTherapistById(therapistId);
          if (response && response.ok) {
            const data = response.data;
            setTherapistData(data["therapist"]);
          }
        } catch (err) {
          console.error(err);
          throw err;
        }
      };

      fetchTherapist(metadata["therapist_id"]);
    }
  }, [metadata]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTherapistData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic goes here. For now, we log the data to the console.
    console.log("Saving org data:", therapistData);
  };

  useEffect(() => {
    // TODO: Add API to fetch therapist by id
  }, []);

  return (
    <div className="dashboard-panel">
      <div className="max-w-4xl w-full mx-auto">
        <Card className="w-full bg-white/70 shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="flex items-center gap-2 text-3xl font-semibold">
              <FaPerson /> Profile
            </h1>
            <Button
              variant="outline"
              size="xs"
              onClick={isEditing ? handleSave : handleEditToggle}
            >
              {isEditing ? (
                <FiSave className="mr-1" />
              ) : (
                <FiEdit className="mr-1" />
              )}
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
          {therapistData ? (
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-2">Name</h3>
                {isEditing ? (
                  <Input
                    type="text"
                    name="name"
                    value={therapistData.therapist_name}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="">{therapistData.therapist_name}</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Email</h3>
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={therapistData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="">{therapistData.email}</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">DOB</h3>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dob"
                    value={therapistData.dob}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="">
                    {new Date(therapistData.dob).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">License Number</h3>
                {isEditing ? (
                  <Input
                    type="text"
                    name="license_number"
                    value={therapistData.license_number}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="">{therapistData.license_number}</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Specialization</h3>
                {isEditing ? (
                  <Input
                    name="description"
                    value={therapistData.specializations
                      .replace(/[{}"]/g, "")
                      .split(",")
                      .join(", ")}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="">
                    {therapistData.specializations
                      .replace(/[{}"]/g, "")
                      .split(",")
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default TherapistProfilePage;
