import SvgLoading from "@/components/ui/svg-loading";

function loading() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='w-32 h-32'>
        <SvgLoading />
      </div>
    </div>
  );
}

export default loading;
