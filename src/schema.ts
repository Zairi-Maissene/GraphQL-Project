import { GraphQLError } from 'graphql';
import { createPubSub } from 'graphql-yoga';
import { PubSub } from 'graphql-yoga';
import { createSchema } from "graphql-yoga";
import { cvSkills } from './context/cvSkills';
import { skills } from './context/skills';
import { users } from './context/users';
import { cvs } from './context/cvs';
import { Subscription } from './subscription';
import { Cv } from './types/cv';
import { CvSkill } from './types/cvSkill';
import { User } from './types/user';
const pubSub = createPubSub();
export const schema = createSchema({
  typeDefs: `
  type User {
  id: String
  name: String
  email: String
  role: String
}
  type Cv {
  id: String
  name: String
  age: Int
  job: String
  user: User
  }
  type Skill {
  id: String
  designation: String
  }
  type CvWithSkills {
    cv: Cv
    skills: [Skill]
    }
  type Query {
    hello: String
    getAllCvs: [Cv]
    getCvById(id: String): CvWithSkills
  }
  input AddCvInput {
  name: String
  age: Int
  job: String
  userId: String  
  }
  input UpdateCvInput {
  name: String
  age: Int
  job: String
  userId: String
  skillIds: [String]
  }
  type Mutation {
  addCv(input:AddCvInput):Cv
  updateCv(id:String,input:UpdateCvInput):Cv
  deleteCv(id: String): Cv
  }
  type Subscription {
    newCv: Cv!
  }
`,
  resolvers: {
    Query: {
      hello: () => "Hello World!",
      getAllCvs: ()  => {
        return cvs
      },
      getCvById: (_,args) => {
        const cv =  cvs.find((cv) => cv?.id === args.id);
        const skillIds = cvSkills.filter((cvSkill) => cvSkill.cvId === args.id).map((cvSkill) => cvSkill.skillId);
        const addedSkills = skills.filter((skill) => skillIds.includes(skill.id))
        return {cv, skills: addedSkills}
      }
    },
    Mutation : {
      addCv:(_,args,context)=>{
      const id = ""+(cvs.length+1);
      const user = users.find((user)=> user.id==args.input.userId);
      if (!user) {
        return
      }
      const cv:Cv ={id,name:args.input.name,user,age:args.input.age,job:args.input.job}
      cvs.push(cv)
      pubSub.publish("newCv", cv);

      return cv
},
    updateCv:(_,args,context)=>{
        const {id, input} = args
        const cvToUpdate = cvs.find((cv) => cv.id === id);
        if (!cvToUpdate) {
          throw new GraphQLError(`Cv with id '${id}' not found.`);
        }
        let user;
        let addedSkills;
        if (input.userId) {
          user = users.find((user) => user.id == input.userId);
          if (!user) {
            throw new GraphQLError(`User with id '${input.userId}' not found.`);
          }
        }
        if (input.skillIds) {
          addedSkills = skills.filter((skill) => input.skillIds.includes(skill.id));
          if (addedSkills.length !== input.skillIds.length) {
            throw new GraphQLError(`Invalid skillIds array.`);
          }
        }
        for (let skillId in input.skillIds) {
          cvSkills.push({cvId: id, skillId})
        }
        delete input.userId;
        delete input.skillIds;
        const cv ={...cvToUpdate, user, ...input}
        cvs.push(cv)
        delete cvs[cvs.indexOf(cvToUpdate)]
        console.log(cvs)
        return cv
      },
      deleteCv(_,args) {
        const { id } = args
        const cvToDelete = cvs.find((cv) => cv.id === id);
        if (!cvToDelete) {
          throw new GraphQLError('Cv with the specified id is not found.')
        }
        const cvsInCvSkills = cvSkills.filter((cvSkill) => cvSkill.cvId === id)
        for (let cvSkill of cvsInCvSkills){
          delete cvSkills[cvSkills.indexOf(cvSkill)]
        }
        delete cvs[cvs.indexOf(cvToDelete)]
        return cvToDelete
      }
    },
  Subscription: {
    newCv: {
      subscribe: (parent, args) => pubSub.subscribe("newCv"),
      resolve: (payload) => { return payload;},
    },
  }
  },

});

