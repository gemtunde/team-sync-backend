import mongoose from "mongoose";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/AppError";
import { TaskStatusEnum } from "../enums/task.enum";

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = new ProjectModel({
    ...(body.emoji && { emoji: body.emoji }),
    name: body.name,
    description: body.description,
    workspace: workspaceId,
    createdBy: userId,
  });

  await project.save();
  return {
    project,
  };
};

export const getAllProjectInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  //find all project in work space
  const totalCount = await ProjectModel.countDocuments({
    workspace: workspaceId,
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await ProjectModel.find({
    workspace: workspaceId,
  })
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy", "_id name profilePicture -password")
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    projects,
    totalCount,
    totalPages,
    skip,
  };
};

export const getProjectByIdAndWorkspaceIdControllerService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project) {
    throw new NotFoundException(
      "project not found or does not belong to this workspace "
    );
  }
  return {
    project,
  };
};
export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });
  if (!project || project.workspace.toString() !== workspaceId) {
    throw new NotFoundException(
      "project not found or does not belong to this workspace "
    );
  }

  const currentDate = new Date();

  //using mongoose AGGREGATE To query the db
  const taskAnalytics = await TaskModel.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $facet: {
        totalTasks: [{ $count: "count" }],
        overdueTasks: [
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: {
                $ne: TaskStatusEnum.DONE,
              },
            },
          },
          {
            $count: "count",
          },
        ],
        completedTasks: [
          {
            $match: { status: TaskStatusEnum.DONE },
          },
          { $count: "count" },
        ],
      },
    },
  ]);
  const _analytics = taskAnalytics[0];

  const analytics = {
    totalTasks: _analytics.totalTasks[0]?.count || 0,
    overdueTasks: _analytics.overdueTasks[0]?.count || 0,
    completedTasks: _analytics.completedTasks[0]?.count || 0,
  };
  return {
    analytics,
  };

  //here is another methods
  //   const totalTasks = await TaskModel.countDocuments({
  //     workspace: workspaceId,
  //   });
  //   const overdueTasks = await TaskModel.countDocuments({
  //     workspace: workspaceId,
  //     dueDate: { $lt: currentDate },
  //     status: { $ne: TaskStatusEnum.DONE },
  //   });
  //   const completedTasks = await TaskModel.countDocuments({
  //     workspace: workspaceId,
  //     status: TaskStatusEnum.DONE,
  //   });
  //   const analytics = {
  //     totalTasks,
  //     overdueTasks,
  //     completedTasks,
  //   };
  //   return {
  //     project,
  //   };
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const { emoji, name, description } = body;

  const project = await ProjectModel.findOne({
    workspace: workspaceId,
    _id: projectId,
  });
  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }
  project.emoji = emoji ? emoji : project.emoji;
  project.name = name ? name : project.name;
  project.description = description ? description : project.description;

  await project.save();
  return {
    project,
  };
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
    workspace: workspaceId,
  });

  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }

  await project.deleteOne();

  await TaskModel.deleteMany({
    project: project._id,
  });

  return project;
};
