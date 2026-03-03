import * as React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Figma,
  Calendar,
  Tag,
  Paperclip,
  Users,
  MoreHorizontal,
  Download,
  Plus,
  ArrowRight,
  Edit2,
  X,
  Share2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Types ──────────────────────────────────────────────────────────────────

type Assignee = {
  name: string;
  avatarUrl: string;
};

type ProjectTag = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type Attachment = {
  name: string;
  size: string;
  type: "pdf" | "figma" | "image";
  url?: string;
};

type SubTask = {
  id: number;
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
};

export type ProjectDetailViewProps = {
  breadcrumbs: { label: string; href?: string; onClick?: () => void }[];
  title: string;
  status: string;
  statusColor?: "gold" | "green" | "muted";
  assignees: Assignee[];
  dateRange: { start: string; end: string };
  tags: ProjectTag[];
  description: string;
  attachments: Attachment[];
  subTasks: SubTask[];
  subTasksTitle?: string;
  onEdit?: () => void;
  onShare?: () => void;
  onClose?: () => void;
};

// ── Sub-components ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const styles: Record<SubTask["status"], string> = {
    Completed:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "In Progress":
      "bg-[#b7a57a]/10 text-[#b7a57a] border-[#b7a57a]/20",
    Pending:
      "bg-white/5 text-white/30 border-white/10",
  };
  return (
    <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-wider", styles[status])}>
      {status}
    </Badge>
  );
};

const FileIcon = ({ type, url }: { type: Attachment["type"]; url?: string }) => {
  if (type === "image" && url)
    return (
      <img src={url} alt="" className="h-10 w-14 rounded object-cover shrink-0" />
    );
  if (type === "pdf") return <FileText className="h-6 w-6 text-red-400" />;
  if (type === "figma") return <Figma className="h-6 w-6 text-purple-400" />;
  return <Paperclip className="h-6 w-6 text-white/30" />;
};

// ── Main Component ─────────────────────────────────────────────────────────

export function ProjectDetailView({
  breadcrumbs,
  title,
  status,
  statusColor = "gold",
  assignees,
  dateRange,
  tags,
  description,
  attachments,
  subTasks,
  subTasksTitle = "Task List",
  onEdit,
  onShare,
  onClose,
}: ProjectDetailViewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  const statusColorMap = {
    gold: "bg-[#b7a57a]/10 text-[#b7a57a] border-[#b7a57a]/25",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    muted: "bg-white/5 text-white/30 border-white/10",
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-none bg-transparent shadow-none">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header */}
        <CardHeader className="p-4 border-b border-white/8 bg-[#0d0a1a]/60 backdrop-blur-sm">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  {b.onClick ? (
                    <button
                      onClick={b.onClick}
                      className="cursor-pointer hover:text-white/60 transition-colors"
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span>{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span className="text-white/15">/</span>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onShare}
                  className="cursor-pointer h-8 w-8 text-white/30 hover:text-white/70 hover:bg-white/5"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="cursor-pointer h-8 w-8 text-white/30 hover:text-white/70 hover:bg-white/5"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="cursor-pointer h-8 w-8 text-white/30 hover:text-white/70 hover:bg-white/5"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-white/90"
          >
            {title}
          </motion.h1>

          {/* Meta Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm"
          >
            {/* Status */}
            <div className="flex items-start gap-3">
              <MoreHorizontal className="h-4 w-4 mt-0.5 text-white/25 shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5">Status</p>
                <Badge
                  variant="outline"
                  className={cn("font-mono text-[10px] uppercase tracking-wider", statusColorMap[statusColor])}
                >
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse inline-block" />
                  {status}
                </Badge>
              </div>
            </div>

            {/* Assignees */}
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 mt-0.5 text-white/25 shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5">Organizer</p>
                <div className="flex flex-col gap-1.5">
                  {assignees.map((a) => (
                    <div key={a.name} className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={a.avatarUrl} alt={a.name} />
                        <AvatarFallback className="bg-[#4b2e83]/40 text-[#b7a57a] text-[9px]">
                          {a.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-white/60">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Date range */}
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-white/25 shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5">Date & Time</p>
                <p className="text-xs text-white/60 flex items-center gap-1.5">
                  {dateRange.start}
                  <ArrowRight className="h-3 w-3 text-white/20" />
                  {dateRange.end}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-start gap-3">
              <Tag className="h-4 w-4 mt-0.5 text-white/25 shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <Badge
                      key={t.label}
                      variant={t.variant}
                      className="text-[10px] font-mono uppercase tracking-wider border-white/10 bg-white/5 text-white/50"
                    >
                      {t.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 col-span-1 md:col-span-2">
              <FileText className="h-4 w-4 mt-0.5 text-white/25 shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5">Description</p>
                <p className="text-sm text-white/50 leading-relaxed">{description}</p>
              </div>
            </div>
          </motion.div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Paperclip className="h-3.5 w-3.5" />
                  Media
                  <span className="text-white/20">({attachments.length})</span>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer h-7 text-[10px] text-white/30 hover:text-white/60 hover:bg-white/5 font-mono uppercase tracking-wider gap-1.5"
                >
                  <Download className="h-3 w-3" />
                  Download All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {attachments.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 p-3 border border-white/8 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                  >
                    <FileIcon type={file.type} url={file.url} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/60 truncate">{file.name}</p>
                      <p className="text-[10px] text-white/25 font-mono">{file.size}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center p-3 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 hover:bg-white/3 transition-all">
                  <Plus className="h-5 w-5 text-white/15" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Sub-tasks / Attendees */}
          {subTasks.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">{subTasksTitle}</h3>
              <div className="overflow-x-auto rounded-xl border border-white/8">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/8 hover:bg-transparent">
                      <TableHead className="text-[10px] font-mono uppercase tracking-wider text-white/25 w-[50px]">
                        No
                      </TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-wider text-white/25">
                        Name
                      </TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-wider text-white/25">
                        Category
                      </TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-wider text-white/25">
                        Status
                      </TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-wider text-white/25 text-right">
                        Info
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subTasks.map((task) => (
                      <TableRow key={task.id} className="border-white/8 hover:bg-white/3">
                        <TableCell className="text-[10px] font-mono text-white/20">{task.id}</TableCell>
                        <TableCell className="text-sm font-medium text-white/70">{task.task}</TableCell>
                        <TableCell className="text-xs text-white/40">{task.category}</TableCell>
                        <TableCell>
                          <StatusBadge status={task.status} />
                        </TableCell>
                        <TableCell className="text-right text-xs text-white/30 font-mono">{task.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </CardContent>
      </motion.div>
    </Card>
  );
}
