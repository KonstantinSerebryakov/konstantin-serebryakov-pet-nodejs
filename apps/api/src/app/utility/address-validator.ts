// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-types */
// import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
// import { Country, State, City }  from 'country-state-city';

// const countriesCodes = Country.sortByIsoCode(Country.getAllCountries()).map(country=>country.isoCode);
// // const citiesCodes = countriesCodes.map((countryCode)=>{
// //     return {
// //         countryCode: countryCode,
// //         citiesCodes: City.getCitiesOfCountry(countryCode)?.map(city=>city.name),
// //     };
// //     });
// export function IsValidCountry(property: string, validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isValidCountry',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [property],
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           return typeof value === 'string' && countriesCodes.indexOf(value) > -1;
//         },
//       },
//     });
//   };
// }

// export function IsCityInCountry(property: string, validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       name: 'isCityInCountry',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [property],
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//             const [relatedPropertyName] = args.constraints;
//             const relatedValue = (args.object as any)[relatedPropertyName];
//             if(typeof value !== 'string' && typeof relatedValue !== 'string') return false;
//             const cities = City.getCitiesOfCountry(relatedValue);
//             return cities !== undefined && cities?.findIndex((city)=>city.name === value) > -1;
//           },
//       },
//     });
//   };
// }