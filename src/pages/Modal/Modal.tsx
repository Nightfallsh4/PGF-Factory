import React from 'react'

const Modal = ({isVisible, onClose}:{isVisible:Boolean, onClose:CallableFunction}) => {
    if (!isVisible) return null;
    const handleClose = (e:React.MouseEvent<HTMLButtonElement>) => {
        if ((e.target as HTMLButtonElement).id === 'wrapper') onClose();
    }
    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id="wrapper" onClick={handleClose}>
            <div className='w-[600px] flex flex-col'>
                <div className='bg-black rounded-xl h-[90vh] w-full relative'>
                    <div className='w-full flex justify-center'>
                        <h1 className='text-2xl m-5 font-bold'>
                            Details
                        </h1>
                    </div>
                    <div className='w-full flex justify-center'>
                        <div className="w-10/12">
                            <img className="rounded-xl" src="https://www.cnet.com/a/img/resize/f6c7acae69061033904163bfd7e3bd0a28158be5/hub/2022/06/06/1e434c1e-e76f-47d3-9365-444ae1e4bddf/screen-shot-2022-06-06-at-11-32-02-am.jpg?auto=webp" alt="" />
                        </div>
                    </div>
                    <div className='w-full p-10'>
                        <h1 className='text-xl font-bold mb-5'>Number #3737</h1>
                        <h1 className='text-lg mb-2'>Product Info</h1>
                        <h1 className='text-xs text-gray-600 mb-5'>Whatever my descriptions is. I am a cool NFT buy me to get lucky or mint me to do okay in life. I AM GROOT.</h1>

                        <h1 className='text-lg mb-2'>NFT Creator</h1>
                        <div className="card_footer">
                            <img className="rounded-full w-12 h-12 mr-5" src="https://m.media-amazon.com/images/I/5118mkJR64L.jpg" alt="" />
                            <p className="text-gray-400">nameofthecreator</p>
                        </div>

                        <h1 className='text-lg mb-2 mt-5'>Timestamp</h1>
                        <div className="">
                            <p className="text-gray-400">Start: #startdate</p>
                            <p className="text-gray-400">End: #enddate</p>
                        </div>
                    </div>
                    <div className='absolute bottom-0 w-full'>
                        <div className='h-24 p-5 border-t-2 rounded-bl-xl rounded-br-xl relative'>
                            <div className='m-2 flex'>
                                {/* <h1 className='text-sm'>
                                    Highest Bid
                                </h1> */}
                                <h1 className='text-3xl text-slate-100'>
                                    0.05 ETH
                                </h1>
                                <div className='bg-white absolute right-0 mr-5 rounded-xl'>
                                    <h1 className='grid justify-items-center pt-2 w-24 h-10 text-black'>
                                        3 Days Left
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Modal