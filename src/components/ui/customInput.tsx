import React from 'react';
import { UseFormRegister, FieldValues, Path, FieldError } from 'react-hook-form';

interface InputProps {
  register: any;
  name: string; 
  type?: string;
  placeholder?: string;
  validation?: object;
  error?: FieldError | undefined;
  id?: string;
  isShown?: boolean
}

const CustomInput: React.FC<InputProps> = ({
  register,
  name,
  type,
  placeholder = '',
  validation = {},
  id,
  error,
  isShown
}) => {
  return (
    <>
      <div className="bg-gray-1100 rounded">
        <div className="relative w-full">
          <input
            type={type}
            id={id}
            {...register(name, validation)} // Register input with validation rules
            placeholder=" "
            className={`peer block w-full appearance-none bg-transparent p-3 pt-[35px] pl-4 pb-2 text-sm text-basic outline-none rounded dark:bg-gray-800 dark:text-gray-400 ${error && "border border-red-500 bg-red-100"}`}
          />
          <label htmlFor="email" className={`absolute top-0 left-4 text-sm text-secondary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-secondary peer-focus:top-0 peer-focus:text-sm mt-3`}>
            {placeholder}
          </label>
          {error && <p className="text-red-500 text-xs lg:text-left text-center dark:bg-black border-none">{error.message}</p>}

        </div>
      </div>
    </>
  );
};

export default CustomInput;
