import { getCompanies } from '@/api/apicompanies';
import { getJobs } from '@/api/apijobs'
import JobCard from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { State } from 'country-state-city';
import { useEffect, useState } from 'react';
import { BarLoader } from "react-spinners";





const JobListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } =useUser();

  
 const {
  fn: fnjobs,
  data: jobs,
  loading: loadingjobs,
 } = useFetch(getJobs, {
   location,
   company_id,
   searchQuery,

 });

 const {
  fn: fnCompanies,
  data: Companies,
  
 } = useFetch(getCompanies);

  useEffect(() =>{ 
  if (isLoaded) fnCompanies();
  }, [isLoaded]);


 useEffect(() =>{ 
   if (isLoaded) fnjobs();
  }, [isLoaded, location, company_id, searchQuery]);

   const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);

   };

   const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");

   };

   if(!isLoaded){
   return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>;
  }


 return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      {/* Add filters here */}
      <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'>
        <Input type="text" placeholder="Search Jobs by Title.." 
        name="search-query" 
        className="h-full flex-auto px-10 text-md"/>
        <Button type="submit" className="h-full sm:w-20" variant="blue">
          Search
        </Button>
      </form>

      <div className='flex flex-col sm:flex-row gap-2'>
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger >
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({name})=>{
                return(
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
                
              })}
              
               
            </SelectGroup>
           </SelectContent>
        </Select>


        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger >
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Companies?.map(({name,id})=>{
                return(
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
                
              })}
              
               
            </SelectGroup>
           </SelectContent>
        </Select>
        <Button onClick={clearFilters} variant='destructive' className='sm:w-1/2'>Clear Filters</Button>




       </div>

      {loadingjobs && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>


      )}

      {loadingjobs ===false && (
        <div className='mr-8 ml-8 mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobs?.length?(
            jobs.map((jobs)=>{
              return <JobCard key={jobs.id} job={jobs}
              savedInit={jobs?.saved?.length>0}
              />;
              
              
            })

          ): (
             <div> No jobs Found ☹️ </div>
          )}
        </div>

      )}
    </div>
  );
  
  



  
};

export default JobListings;


 
 