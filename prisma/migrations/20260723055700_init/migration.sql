-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "secondName" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" TEXT,
    "gender" TEXT,
    "weight" TEXT,
    "height" TEXT,
    "fitnessGoal" TEXT,
    "experienceLevel" TEXT,
    "injuries" TEXT,
    "refreshToken" TEXT,
    "signInType" INTEGER NOT NULL DEFAULT 1,
    "isProfileSetup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "splitType" TEXT NOT NULL,
    "createdByAI" BOOLEAN NOT NULL DEFAULT true,
    "duration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutDay" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "focus" TEXT NOT NULL,

    CONSTRAINT "WorkoutDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sets" TEXT NOT NULL,
    "reps" TEXT NOT NULL,
    "rest" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT,
    "date" TEXT NOT NULL,
    "duration" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseLog" (
    "id" TEXT NOT NULL,
    "workoutLogId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sets" TEXT NOT NULL,
    "reps" TEXT NOT NULL,
    "weight" TEXT NOT NULL,

    CONSTRAINT "ExerciseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "bodyFat" TEXT,
    "chest" TEXT,
    "waist" TEXT,
    "biceps" TEXT,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calories" TEXT NOT NULL,
    "protein" TEXT NOT NULL,
    "carbs" TEXT NOT NULL,
    "fats" TEXT NOT NULL,
    "dietType" TEXT,
    "goal" TEXT,
    "meals" JSONB,
    "mealTimings" JSONB,
    "date" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recovery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sleepHours" DOUBLE PRECISION NOT NULL,
    "soreness" INTEGER NOT NULL,
    "fatigue" INTEGER NOT NULL,
    "stress" INTEGER NOT NULL,
    "hydration" DOUBLE PRECISION NOT NULL,
    "recoveryScore" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "requestData" JSONB,
    "responseData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Workout_userId_idx" ON "Workout"("userId");

-- CreateIndex
CREATE INDEX "WorkoutDay_workoutId_idx" ON "WorkoutDay"("workoutId");

-- CreateIndex
CREATE INDEX "Exercise_dayId_idx" ON "Exercise"("dayId");

-- CreateIndex
CREATE INDEX "WorkoutLog_userId_idx" ON "WorkoutLog"("userId");

-- CreateIndex
CREATE INDEX "WorkoutLog_userId_date_idx" ON "WorkoutLog"("userId", "date");

-- CreateIndex
CREATE INDEX "ExerciseLog_workoutLogId_idx" ON "ExerciseLog"("workoutLogId");

-- CreateIndex
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");

-- CreateIndex
CREATE INDEX "Progress_userId_date_idx" ON "Progress"("userId", "date");

-- CreateIndex
CREATE INDEX "Diet_userId_idx" ON "Diet"("userId");

-- CreateIndex
CREATE INDEX "Recovery_userId_idx" ON "Recovery"("userId");

-- CreateIndex
CREATE INDEX "Recovery_userId_date_idx" ON "Recovery"("userId", "date");

-- CreateIndex
CREATE INDEX "AIHistory_userId_idx" ON "AIHistory"("userId");

-- CreateIndex
CREATE INDEX "AIHistory_userId_requestType_idx" ON "AIHistory"("userId", "requestType");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutDay" ADD CONSTRAINT "WorkoutDay_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "WorkoutDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diet" ADD CONSTRAINT "Diet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recovery" ADD CONSTRAINT "Recovery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIHistory" ADD CONSTRAINT "AIHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
