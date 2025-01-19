import { getSingleJob, updateHiringStatus } from "@/api/apijobs";
import ApplicationCard from "@/components/applicationcard";
import ApplyJobDrawer from "@/components/apply-job";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";




const JobPage = () => {

  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const{
    loading: loadingjobs,
    data: jobs,
    fn: fnjobs,

  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { loading: loadingHiringStatus, fn:fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange =(value)=>{
    const isOpen = value ==="open";
    fnHiringStatus(isOpen).then(() => fnjobs());

  };

  useEffect(() => {
    if (isLoaded) fnjobs();
  }, [isLoaded]);

  if(!isLoaded || loadingjobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const formattedRequirements = jobs?.requirements
  .split('\n') // Split by newline
  .map(item => item.trim()) // Trim spaces
  .filter(item => item) // Remove empty lines
  .map(item => `- ${item}`) // Ensure every requirement starts with '-'
  .join('\n'); // Join everything back


  console.log(formattedRequirements); // Check the output in the console

  



  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
          <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">{jobs?.title}</h1>
          <img src={jobs?.company?.logo_url} className="h-12" alt={jobs?.title} />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {jobs?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {jobs?.applications?.length} Applicants

        </div>
        <div className="flex gap-2">
          {jobs?.isOpen ? (
            <>
             <DoorOpen />Open
            </>
            ): (
            <>
             <DoorClosed/>Closed
            </>
          )}
        </div>

      </div>

      {/* hiring status */}
      {jobs?.recruiter_id === user?.id && (
        <Select onValueChange= {handleStatusChange}>
          <SelectTrigger className={`w-full ${jobs?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue 
              placeholder={
               "Hiring Status" + (jobs?.isOpen ? "( Open )" : "( Closed )")
              }/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
       </Select>
      )}     
              
          
            
             
          
         

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{jobs?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      
      <div className="wmde-markdown">
        <MDEditor.Markdown 
         source={formattedRequirements}
         className="bg-transparent sm:text-lg" 

         
        />

       {/*  render applications */}
       {jobs?.recruiter_id !== user?.id && (
         <ApplyJobDrawer job={jobs} 
           user={user} 
           fetchJob={fnjobs} 
            applied ={jobs?.applications?.find((ap) => ap.candidate_id === user.id)}
          />
        )}

        {jobs?.applications?.length > 0 && jobs?.recruiter_id === user?.id &&(
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
            {jobs?.applications.map((application)=>{
              return (
              <ApplicationCard  key={application.id} application={application} />
            );
            })}
          </div>

        )}
      </div>

    </div>
  );
};

export default JobPage;