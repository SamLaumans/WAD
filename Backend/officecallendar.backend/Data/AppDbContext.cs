using Microsoft.EntityFrameworkCore;
using Officecalendar.Backend.Models;

namespace WADapi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventSubscription> EventSubscriptions { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageReceiver> MessageReceivers { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomBooking> RoomBookings { get; set; }
        public DbSet<GroupMembership> GroupMemberships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define keys

            modelBuilder.Entity<GroupMembership>()
                .HasKey(gm => new { gm.username, gm.group_id });

            modelBuilder.Entity<MessageReceiver>()
                .HasKey(mr => new { mr.message_id, mr.username });

            modelBuilder.Entity<EventSubscription>()
                .HasKey(es => new { es.username, es.event_id });

            modelBuilder.Entity<RoomBookingRoom>()
                .HasKey(rbr => new { rbr.booking_id, rbr.room_id });

            // Group membership
            modelBuilder.Entity<GroupMembership>()
                .HasOne(gm => gm.User)
                .WithMany(u => u.GroupMemberships)
                .HasForeignKey(gm => gm.username)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GroupMembership>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.GroupMemberships)
                .HasForeignKey(gm => gm.group_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Messages received
            modelBuilder.Entity<MessageReceiver>()
                .HasOne(mr => mr.User)
                .WithMany(u => u.MessageReceivers)
                .HasForeignKey(mr => mr.username)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MessageReceiver>()
                .HasOne(mr => mr.Message)
                .WithMany(g => g.MessageReceivers)
                .HasForeignKey(mr => mr.message_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Messages
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Event)
                .WithMany(e => e.Messages)
                .HasForeignKey(m => m.referenced_event_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Events subscribed
            modelBuilder.Entity<EventSubscription>()
                .HasOne(es => es.User)
                .WithMany(u => u.EventSubscriptions)
                .HasForeignKey(es => es.username)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EventSubscription>()
                .HasOne(es => es.Event)
                .WithMany(e => e.EventSubscriptions)
                .HasForeignKey(es => es.event_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Events

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Creator)
                .WithMany(u => u.CreatedEvents)
                .HasForeignKey(e => e.creator_username)
                .OnDelete(DeleteBehavior.Restrict);

            // Room bookings
            modelBuilder.Entity<RoomBooking>()
                .HasOne(rb => rb.User)
                .WithMany(u => u.RoomBookings)
                .HasForeignKey(rb => rb.booked_by)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomBooking>()
                .HasOne(rb => rb.Event)
                .WithMany(e => e.RoomBookings)
                .HasForeignKey(rb => rb.event_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Room booking room

            modelBuilder.Entity<RoomBookingRoom>()
                .HasOne(rbr => rbr.RoomBooking)
                .WithMany(rb => rb.RoomBookingRooms)
                .HasForeignKey(rbr => rbr.booking_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoomBookingRoom>()
                .HasOne(rbr => rbr.Room)
                .WithMany(r => r.RoomBookingRooms)
                .HasForeignKey(rbr => rbr.room_id)
                .OnDelete(DeleteBehavior.Cascade);

            // Reviews
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.username)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Event)
                .WithMany(e => e.Reviews)
                .HasForeignKey(r => r.event_id)
                .OnDelete(DeleteBehavior.Restrict);

            // Attendance

            modelBuilder.Entity<Attendance>()
            .HasOne(a => a.User)
            .WithMany(u => u.Attendances)
            .HasForeignKey(a => a.username)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Attendance>()
            .HasOne(a => a.CreatorUser)
            .WithMany()
            .HasForeignKey(a => a.creator_username)
            .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
