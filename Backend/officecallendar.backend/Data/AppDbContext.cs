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
        public DbSet<GroupMembership> GroupMemberships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define keys

            modelBuilder.Entity<GroupMembership>()
                .HasKey(gm => new { gm.username, gm.group_id });

            modelBuilder.Entity<MessageReceiver>()
                .HasKey(mr => new { mr.message_id, mr.username });

            // Group membership
            modelBuilder.Entity<GroupMembership>()
                .HasOne(gm => gm.User)
                .WithMany(u => u.GroupMemberships)
                .HasForeignKey(gm => gm.username)
                .HasPrincipalKey(u => u.username);

            modelBuilder.Entity<GroupMembership>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.GroupMemberships)
                .HasForeignKey(gm => gm.group_id);

            // Messages received
            modelBuilder.Entity<MessageReceiver>()
                .HasOne(mr => mr.User)
                .WithMany(u => u.MessageReceivers)
                .HasForeignKey(mr => mr.username)
                .HasPrincipalKey(u => u.username);

            modelBuilder.Entity<MessageReceiver>()
                .HasOne(mr => mr.Message)
                .WithMany(g => g.MessageReceivers)
                .HasForeignKey(mr => mr.message_id);

            // Events subscribed
            modelBuilder.Entity<EventSubscription>()
                .HasOne(es => es.User)
                .WithMany(u => u.EventSubscriptions)
                .HasForeignKey(es => es.username)
                .HasPrincipalKey(u => u.username);

            modelBuilder.Entity<EventSubscription>()
                .HasOne(es => es.Event)
                .WithMany(e => e.EventSubscriptions)
                .HasForeignKey(es => es.event_id);

            // Room bookings
            modelBuilder.Entity<RoomBooking>()
                .HasOne(rb => rb.User)
                .WithMany(u => u.RoomBookings)
                .HasForeignKey(rb => rb.booked_by)
                .HasPrincipalKey(u => u.username);

            modelBuilder.Entity<RoomBooking>()
                .HasOne(rb => rb.Room)
                .WithMany(r => r.RoomBookings)
                .HasForeignKey(rb => rb.room_id);

            modelBuilder.Entity<RoomBooking>()
                .HasOne(rb => rb.Event)
                .WithMany(e => e.RoomBookings)
                .HasForeignKey(rb => rb.event_id);
        }
    }
}
