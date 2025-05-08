"use client"

type AuthFormProps = {
    title: string;
    buttonText: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showName?: boolean; // true for register, expecting false by default
    errorMessage: string;
   
  };
  

//   using a shared component for both login and register
  export default function AuthForm({
    title,
    buttonText,
    onSubmit,
    showName = false,
    errorMessage,
    
  }: AuthFormProps) {
    return (
      <div className="card bg-base-100 w-full max-w-md mx-auto shadow-2xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
          <form className="form-control space-y-4" onSubmit={onSubmit}>
            {showName && (
              <>
                <label className="label" htmlFor="name">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input input-bordered w-full"
                  placeholder="Your name"
                  required
                />
              </>
            )}
            
  
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full"
              placeholder="Email"
              required
            />
  
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input input-bordered w-full"
              placeholder="Password"
              required
            />
  
            <button className="btn  btn-info text-white w-full mt-4 hover:bg-green-500 uppercase">{buttonText}</button>
            {errorMessage && <p className="text-red-400">{errorMessage}</p>}
          </form>
        </div>
      </div>
    );
  }
  